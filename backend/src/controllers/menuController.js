import cloudinary from "../config/cloudinary.js";
import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import Review from "../models/Review.js";

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function invalidIdResponse(res, label = "Invalid id") {
  return res.status(400).json({
    success: false,
    message: label,
  });
}

/* ===========================
   ADMIN STATS
=========================== */

export const getAdminStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const revenueData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const activeOrders = await Order.countDocuments({
      status: { $in: ["pending", "preparing", "ready"] },
    });
    const menuItems = await MenuItem.countDocuments();
    const bestSellers = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.menuItem",
          quantity: { $sum: "$items.quantity" },
        },
      },
      { $sort: { quantity: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "menuitems",
          localField: "_id",
          foreignField: "_id",
          as: "item",
        },
      },
      { $unwind: "$item" },
      {
        $project: {
          _id: "$item._id",
          name: "$item.name",
          quantity: 1,
          revenue: { $multiply: ["$quantity", "$item.price"] },
        },
      },
    ]);

    res.json({
      success: true,
      totalOrders,
      totalRevenue,
      activeOrders,
      menuItems,
      bestSellers,
      data: {
        totalOrders,
        totalRevenue,
        activeOrders,
        menuItems,
        bestSellers,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   CATEGORY
=========================== */

export const createCategory = async (req, res) => {
  try {
    const category = await Category.create({
      name: req.body.name,
    });

    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   CREATE MENU ITEM
=========================== */
export const createMenuItem = async (req, res) => {
  console.log("🔥 createMenuItem called");
  try {
    const body = req.body || {};
    const price = Number(body.price);
    console.log(req.body);
    console.log(req.file);
    if (!body.name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    if (!price) {
      return res.status(400).json({
        success: false,
        message: "Price is required",
      });
    }

    if (!body.category) {
      return res.status(400).json({
        success: false,
        message: "Category is required",
      });
    }

    if (!isValidObjectId(body.category)) {
      return invalidIdResponse(res, "Invalid category");
    }

    const item = await MenuItem.create({
      name: body.name.trim(),
      price,
      description: body.description,
      category: body.category,
      type: body.type || "veg",
      image: req.file?.path || "",
      imagePublicId: req.file?.filename || "",
      isChefSpecial: body.isChefSpecial === "true",
      isAvailable: body.isAvailable !== "false",
    });

    const created = await MenuItem.findById(item._id)
      .populate("category", "name image description");

    return res.status(201).json(created);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   TOGGLE AVAILABILITY
=========================== */

export const toggleAvailability = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return invalidIdResponse(res);
    }

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.isAvailable = !item.isAvailable;

    await item.save();

    const updated = await MenuItem.findById(item._id)
      .populate("category", "name image description");

    res.json(updated);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   UPDATE MENU ITEM
=========================== */

export const updateMenuItem = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return invalidIdResponse(res);
    }

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (req.file?.path) {
      if (item.imagePublicId) {
        await cloudinary.uploader.destroy(item.imagePublicId);
      }

      item.image = req.file.path;
      item.imagePublicId = req.file.filename || "";
    }

    if (req.body.category && !isValidObjectId(req.body.category)) {
      return invalidIdResponse(res, "Invalid category");
    }

    item.name = req.body.name?.trim() || item.name;
    item.price = req.body.price !== undefined ? Number(req.body.price) : item.price;
    item.description = req.body.description ?? item.description;
    item.category = req.body.category ?? item.category;
    item.type = req.body.type ?? item.type;
    if (req.body.isChefSpecial !== undefined) {
      item.isChefSpecial = req.body.isChefSpecial === "true" || req.body.isChefSpecial === true;
    }
    if (req.body.isAvailable !== undefined) {
      item.isAvailable = req.body.isAvailable === "true" || req.body.isAvailable === true;
    }

    await item.save();

    const updated = await MenuItem.findById(item._id)
      .populate("category", "name image description");

    res.json({
      success: true,
      data: updated,
      item: updated,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   DELETE MENU ITEM
=========================== */

export const deleteMenuItem = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return invalidIdResponse(res);
    }

    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (item.imagePublicId) {
      await cloudinary.uploader.destroy(item.imagePublicId);
    }

    await item.deleteOne();

    res.json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   REORDER CATEGORIES
=========================== */

export const reorderCategories = async (req, res) => {
  try {
    const { categories } = req.body;

    const bulkOps = categories.map((cat) => ({
      updateOne: {
        filter: { _id: cat.id },
        update: { order: cat.order },
      },
    }));

    await Category.bulkWrite(bulkOps);

    res.json({
      message: "Reordered successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   GET ALL MENU ITEMS
=========================== */

export const getMenuItems = async (req, res) => {
  try {
    const items = await MenuItem.find()
      .populate("category", "name image description");

    const menuWithReviews = await Promise.all(
      items.map(async (item) => {
        const reviews = await Review.find({
          menuItem: item._id,
          status: "approved",
          isDeleted: false,
        }).sort({ createdAt: -1 });
        console.log("Item:", item.name);
        console.log("Item ID:", item._id);
        console.log("Reviews Found:", reviews);
        const count = reviews.length;

        const avg =
          count > 0
            ? reviews.reduce((sum, review) => sum + review.rating, 0) / count
            : 0;

        return {
          ...item.toObject(),
          avg,
          count,
          topReview:
            count > 0
              ? {
                text: reviews[0].comment,
                user: reviews[0].anonymous
                  ? "Anonymous"
                  : reviews[0].customerName,
                ini: (
                  reviews[0].anonymous
                    ? "A"
                    : reviews[0].customerName.charAt(0)
                ).toUpperCase(),
                ava: "#D4AA5A",
                time: new Date(reviews[0].createdAt).toLocaleDateString(),
              }
              : null,
        };
      })
    );

    res.json(menuWithReviews);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   GET MENU ITEM BY ID
=========================== */

export const getMenuItemById = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return invalidIdResponse(res);
    }

    const item = await MenuItem.findById(req.params.id)
      .populate("category", "name image description");

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   GET ITEMS BY CATEGORY
=========================== */

export const getItemsByCategory = async (req, res) => {
  try {
    if (!isValidObjectId(req.params.categoryId)) {
      return invalidIdResponse(res, "Invalid category");
    }

    const items = await MenuItem.find({
      category: req.params.categoryId,
      isAvailable: true,
    }).populate("category", "name image description");

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

/* ===========================
   SEARCH MENU ITEMS
=========================== */

export const searchMenuItems = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const items = await MenuItem.find({
      name: {
        $regex: keyword,
        $options: "i",
      },
    }).populate("category", "name image description");

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


