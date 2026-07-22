import express from "express";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";
import { adminOnly, protect, optionalProtect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

// Get all categories
// Public + Optional Token
router.get("/", optionalProtect, getCategories);

// Create category
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createCategory
);

// Update category
router.put(
  "/:id",
  validateObjectId(),
  protect,
  adminOnly,
  upload.single("image"),
  updateCategory
);

// Delete category
router.delete(
  "/:id",
  validateObjectId(),
  protect,
  adminOnly,
  deleteCategory
);

export default router;
