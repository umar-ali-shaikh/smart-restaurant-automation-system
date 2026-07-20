import express from "express";
import {
  createCategory,
  toggleAvailability,
  updateMenuItem,
  deleteMenuItem,
  reorderCategories,
  getMenuItems,
  getMenuItemById,
  getItemsByCategory,
  searchMenuItems,
  getAdminStats,
  createMenuItem,
} from "../controllers/menuController.js";

import {
  protect,
  adminOnly,
  optionalProtect,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";

const router = express.Router();

/* ===========================
   ADMIN ONLY
=========================== */

router.get("/stats", protect, adminOnly, getAdminStats);

router.post(
  "/item",
  protect,
  adminOnly,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("UPLOAD ERROR:", err);
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      console.log("UPLOAD SUCCESS");
      next();
    });
  },
  createMenuItem
);

router.post("/category", protect, adminOnly, createCategory);

router.patch(
  "/item/:id/toggle",
  protect,
  adminOnly,
  toggleAvailability
);

router.put(
  "/item/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateMenuItem
);

router.delete(
  "/item/:id",
  protect,
  adminOnly,
  deleteMenuItem
);

router.put(
  "/category/reorder",
  protect,
  adminOnly,
  reorderCategories
);

/* ===========================
   PUBLIC (TOKEN OPTIONAL)
=========================== */

router.get("/", optionalProtect, getMenuItems);

router.get("/item/:id", optionalProtect, getMenuItemById);

router.get(
  "/category/:categoryId",
  optionalProtect,
  getItemsByCategory
);

router.get("/search", optionalProtect, searchMenuItems);

export default router;