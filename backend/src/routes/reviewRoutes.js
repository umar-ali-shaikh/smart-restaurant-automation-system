import express from "express";
import {
  addReview,
  deleteReview,
  getReviews,
  getReviewAnalytics,
  moderateReview,
  replyToReview,
  updateReview,
} from "../controllers/reviewController.js";

import {
  protect,
  adminOnly,
  optionalProtect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   PUBLIC
=========================== */

router.get("/", optionalProtect, getReviews);

router.post("/", optionalProtect, addReview);

/* ===========================
   ADMIN
=========================== */

router.get("/analytics", protect, adminOnly, getReviewAnalytics);

router.put("/:id", protect, adminOnly, updateReview);

router.patch("/:id/status", protect, adminOnly, moderateReview);

router.patch("/:id/reply", protect, adminOnly, replyToReview);

router.delete("/:id", protect, adminOnly, deleteReview);

export default router;