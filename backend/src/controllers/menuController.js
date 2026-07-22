import cloudinary from "../config/cloudinary.js";
import MenuItem from "../models/MenuItem.js";
import Category from "../models/Category.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";
import { findMenuItemById, findMenuItems } from "../modules/menu/menuCatalogService.js";
import { getOrderAnalytics } from "../modules/analytics/analyticsService.js";

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
    const analytics = await getOrderAnalytics(req.query);
    const menuItems = await MenuItem.countDocuments();
    const activeOrders = analytics.pending + analytics.preparing + analytics.ready;

    res.json({
      success: true,
      ...analytics,
      activeOrders,
      menuItems,
      data: {
        ...analytics,
        activeOrders,
        menuItems,
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

/* ===========================
   CREATE MENU ITEM
=========================== */
export const createMenuItem = async (req, res) => {
  console.log("🔥 createMenuItem called");
  try {
    const body = req.body || {};
    const price = Number(body.price);
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
    const items = await findMenuItems();
    res.json(items.map((item) => ({
      ...item,
      avg: item.averageRating,
      count: item.reviewCount,
      topReview: item.latestReview ? {
        text: item.latestReview.comment,
        user: item.latestReview.anonymous ? "Anonymous" : item.latestReview.customerName,
        ini: (item.latestReview.anonymous ? "A" : item.latestReview.customerName?.charAt(0) || "G").toUpperCase(),
        ava: "#D4AA5A",
        time: new Date(item.latestReview.createdAt).toLocaleDateString(),
      } : null,
    })));
  } catch (error) {
    res.status(error.statusCode || 500).json({ success: false, message: error.message });
  }
};

/* ===========================
   GET MENU ITEM BY ID
=========================== */

export const getMenuItemById = async (req, res) => {
  try {
    const item = await findMenuItemById(req.params.id);

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
    const items = await findMenuItems({ categoryId: req.params.categoryId });

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
    const items = await findMenuItems({ search: req.query.q || "" });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


