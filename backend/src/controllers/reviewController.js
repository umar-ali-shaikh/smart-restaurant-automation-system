import mongoose from "mongoose";
import Review from "../models/Review.js";

const parseBoolean = (value) => value === true || value === "true" || value === "1";

const parseNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
};

const parseSelectedItems = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const clampRating = (value) => {
  const rating = parseNumber(value);
  if (!rating) return undefined;
  return Math.min(5, Math.max(1, rating));
};

const buildReviewPayload = (body) => {
  const anonymous = parseBoolean(body.anonymous);

  const selectedItems = parseSelectedItems(body.selectedItems).map((item) => ({
    menuItem: mongoose.Types.ObjectId.isValid(item.menuItem || item.id)
      ? item.menuItem || item.id
      : undefined,

    name: item.name?.trim() || "",
    quantity: parseNumber(item.quantity || item.qty) || 1,
  }));

  const menuItem =
    mongoose.Types.ObjectId.isValid(body.menuItem)
      ? body.menuItem
      : selectedItems[0]?.menuItem;

  return {
    customerName: anonymous
      ? "Anonymous Guest"
      : body.customerName?.trim() || "Guest",

    customerEmail: anonymous
      ? ""
      : body.customerEmail?.trim().toLowerCase() || "",

    tableNo: parseNumber(body.tableNo),

    orderId: mongoose.Types.ObjectId.isValid(body.orderId)
      ? body.orderId
      : undefined,

    menuItem,   // ✅ add this

    rating: clampRating(body.rating),

    comment: body.comment?.trim() || "",

    selectedItems,

    anonymous,

    status: ["approved", "pending", "rejected"].includes(body.status)
      ? body.status
      : "pending",
  };
};

const getDateMatch = (query) => {
  const now = new Date();
  const start = query.start ? new Date(query.start) : null;
  const end = query.end ? new Date(query.end) : null;

  if (start && !Number.isNaN(start.getTime()) && end && !Number.isNaN(end.getTime())) {
    end.setHours(23, 59, 59, 999);
    return { createdAt: { $gte: start, $lte: end } };
  }

  if (query.period === "today") {
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);
    return { createdAt: { $gte: today } };
  }

  if (query.period === "month") {
    return {
      createdAt: {
        $gte: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    };
  }

  return {};
};

export const addReview = async (req, res) => {
  try {
    const payload = buildReviewPayload(req.body);

    // Validate required rating
    if (payload.rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Overall rating is required.",
      });
    }

    // Validate rating range
    if (payload.rating < 1 || payload.rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const review = await Review.create(payload);

    // Emit socket event if Socket.IO is available
    const io = req.app.get("io");
    if (io) {
      io.emit("review:new", review);
    }

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Add Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to submit review. Please try again later.",
    });
  }
};

export const getReviews = async (req, res) => {
  try {
    const {
      status = "all",
      page = 1,
      limit = 10,
      sort = "desc",
    } = req.query;

    const query = {
      ...getDateMatch(req.query),
    };

    // Public users can only see approved reviews
    if (!req.user) {
      query.status = "approved";
    } else if (status !== "all") {
      query.status = status;
    }

    const currentPage = Math.max(1, Number(page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(limit) || 10));

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .populate("orderId", "tableNo total status")
        .populate("reply.repliedBy", "name username role")
        .sort({
          createdAt: sort === "asc" ? 1 : -1,
        })
        .skip((currentPage - 1) * pageSize)
        .limit(pageSize)
        .lean(),

      Review.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      message: "Reviews fetched successfully.",
      data: reviews,

      pagination: {
        total,
        page: currentPage,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
        hasNext: currentPage * pageSize < total,
        hasPrevious: currentPage > 1,
      },
    });
  } catch (error) {
    console.error("Get Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reviews.",
    });
  }
};

export const getReviewAnalytics = async (req, res) => {
  try {
    const match = getDateMatch(req.query);

    const reviews = await Review.find(match).lean();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const itemMap = new Map();

    const ratingDistribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    let totalReviews = 0;
    let totalRating = 0;

    let todayReviews = 0;
    let monthlyReviews = 0;

    let approvedReviews = 0;
    let pendingReviews = 0;
    let rejectedReviews = 0;

    for (const review of reviews) {
      totalReviews++;
      totalRating += review.rating || 0;

      if (ratingDistribution[review.rating] !== undefined) {
        ratingDistribution[review.rating]++;
      }

      const createdAt = new Date(review.createdAt);

      if (createdAt >= today) {
        todayReviews++;
      }

      if (createdAt >= monthStart) {
        monthlyReviews++;
      }

      switch (review.status) {
        case "approved":
          approvedReviews++;
          break;

        case "pending":
          pendingReviews++;
          break;

        case "rejected":
          rejectedReviews++;
          break;
      }

      if (review.selectedItems?.length) {
        for (const item of review.selectedItems) {
          const key = item.name || "Unnamed Item";

          const entry = itemMap.get(key) || {
            name: key,
            count: 0,
            totalRating: 0,
          };

          entry.count++;
          entry.totalRating += review.rating;

          itemMap.set(key, entry);
        }
      }
    }

    const topFoods = Array.from(itemMap.values())
      .map((item) => ({
        name: item.name,
        count: item.count,
        averageRating: Number(
          (item.totalRating / item.count).toFixed(1)
        ),
      }))
      .sort((a, b) => b.count - a.count);

    return res.status(200).json({
      success: true,
      message: "Review analytics fetched successfully.",
      data: {
        totalReviews,

        averageRating: totalReviews
          ? Number((totalRating / totalReviews).toFixed(1))
          : 0,

        todayReviews,

        monthlyReviews,

        approvedReviews,

        pendingReviews,

        rejectedReviews,

        ratingDistribution: [
          { rating: 1, count: ratingDistribution[1] },
          { rating: 2, count: ratingDistribution[2] },
          { rating: 3, count: ratingDistribution[3] },
          { rating: 4, count: ratingDistribution[4] },
          { rating: 5, count: ratingDistribution[5] },
        ],

        mostReviewedFood: topFoods[0] || null,

        topReviewedFoods: topFoods.slice(0, 5),
      },
    });
  } catch (error) {
    console.error("Review Analytics Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to calculate review analytics.",
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    // Update only provided fields
    if ("customerName" in req.body) {
      review.customerName = req.body.customerName?.trim() || review.customerName;
    }

    if ("customerEmail" in req.body) {
      review.customerEmail =
        req.body.customerEmail?.trim().toLowerCase() || "";
    }

    if ("tableNo" in req.body) {
      review.tableNo = parseNumber(req.body.tableNo);
    }

    if ("orderId" in req.body) {
      review.orderId = mongoose.Types.ObjectId.isValid(req.body.orderId)
        ? req.body.orderId
        : review.orderId;
    }
    
    if ("menuItem" in req.body) {
      review.menuItem = mongoose.Types.ObjectId.isValid(req.body.menuItem)
        ? req.body.menuItem
        : review.menuItem;
    }

    if ("rating" in req.body) {
      const rating = clampRating(req.body.rating);

      if (!rating) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5.",
        });
      }

      review.rating = rating;
    }

    if ("comment" in req.body) {
      review.comment = req.body.comment?.trim() || "";
    }

    if ("anonymous" in req.body) {
      review.anonymous = parseBoolean(req.body.anonymous);
    }

    if ("status" in req.body) {
      if (!["pending", "approved", "rejected"].includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid review status.",
        });
      }

      review.status = req.body.status;
    }

    if ("selectedItems" in req.body) {
      review.selectedItems = parseSelectedItems(req.body.selectedItems).map(
        (item) => ({
          menuItem: mongoose.Types.ObjectId.isValid(item.menuItem || item.id)
            ? item.menuItem || item.id
            : undefined,

          name: item.name?.trim() || "",

          quantity: parseNumber(item.quantity || item.qty) || 1,
        })
      );
    }

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review.",
    });
  }
};

export const moderateReview = async (req, res) => {
  try {
    const status = req.body.status;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review status",
      });
    }

    const updated = await Review.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: `Review ${status}`,
      data: updated,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to moderate review",
    });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    // Validate Review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    // Validate Reply
    if (!text?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Reply text is required.",
      });
    }

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.reply = {
      text: text.trim(),
      repliedBy: req.user._id,
      repliedAt: new Date(),
    };

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Reply added successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Reply Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to reply to review.",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate Review ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID.",
      });
    }

    const review = await Review.findById(id);

    if (!review || review.isDeleted) {
      return res.status(404).json({
        success: false,
        message: "Review not found.",
      });
    }

    review.isDeleted = true;
    review.deletedAt = new Date();
    review.deletedBy = req.user._id;

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review.",
    });
  }
};
