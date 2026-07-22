import express from "express";
import {
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
import { createCategory as createCategoryResource } from "../controllers/categoryController.js";

import {
  protect,
  adminOnly,
  optionalProtect,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/upload.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

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
        console.error("Menu image upload failed:", err.message);
        return res.status(err.statusCode || (err.code?.startsWith("LIMIT") ? 400 : 500)).json({
          success: false,
          message: err.message,
        });
      }

      next();
    });
  },
  createMenuItem
);

router.post(
  "/category",
  protect,
  adminOnly,
  upload.single("image"),
  createCategoryResource,
);

router.patch(
  "/item/:id/toggle",
  validateObjectId(),
  protect,
  adminOnly,
  toggleAvailability
);

router.put(
  "/item/:id",
  validateObjectId(),
  protect,
  adminOnly,
  upload.single("image"),
  updateMenuItem
);

router.delete(
  "/item/:id",
  validateObjectId(),
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

router.get("/item/:id", validateObjectId(), optionalProtect, getMenuItemById);

router.get(
  "/category/:categoryId",
  validateObjectId("categoryId"),
  optionalProtect,
  getItemsByCategory
);

router.get("/search", optionalProtect, searchMenuItems);

export default router;
