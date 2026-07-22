import mongoose from "mongoose";
import MenuItem from "../../models/MenuItem.js";

function ensureObjectId(value, label = "Invalid id") {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    const error = new Error(label);
    error.statusCode = 400;
    throw error;
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function findMenuItems({ categoryId, search } = {}) {
  const match = {};

  if (categoryId) {
    ensureObjectId(categoryId, "Invalid category");
    match.category = new mongoose.Types.ObjectId(categoryId);
    match.isAvailable = true;
  }

  if (search?.trim()) {
    match.name = { $regex: escapeRegex(search.trim().slice(0, 100)), $options: "i" };
  }

  return MenuItem.aggregate([
    { $match: match },
    { $lookup: { from: "categories", localField: "category", foreignField: "_id", as: "category" } },
    { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "reviews",
        let: { menuItemId: "$_id" },
        pipeline: [
          { $match: { $expr: { $eq: ["$menuItem", "$$menuItemId"] }, status: "approved", isDeleted: false } },
          { $sort: { createdAt: -1 } },
          { $limit: 100 },
          { $project: { rating: 1, comment: 1, customerName: 1, anonymous: 1, createdAt: 1 } },
        ],
        as: "reviews",
      },
    },
    { $addFields: { reviewCount: { $size: "$reviews" }, averageRating: { $ifNull: [{ $avg: "$reviews.rating" }, 0] }, latestReview: { $arrayElemAt: ["$reviews", 0] } } },
    { $project: { reviews: 0, "category.createdAt": 0, "category.updatedAt": 0 } },
    { $sort: { createdAt: -1 } },
  ]);
}

export function findMenuItemById(id) {
  ensureObjectId(id);
  return MenuItem.findById(id).populate("category", "name image description");
}
