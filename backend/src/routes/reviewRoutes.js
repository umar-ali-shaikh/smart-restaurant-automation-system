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
  optionalStaffAuth,
  requireGuestAuth,
} from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createReviewSchema } from "../shared/validation/schemas.js";

const router = express.Router();

/* ===========================
   PUBLIC
=========================== */

router.get("/", optionalStaffAuth, getReviews);

router.post("/", validateRequest({ body: createReviewSchema }), requireGuestAuth, addReview);

/* ===========================
   ADMIN
=========================== */

router.get("/analytics", protect, adminOnly, getReviewAnalytics);

router.put("/:id", validateObjectId(), protect, adminOnly, updateReview);

router.patch("/:id/status", validateObjectId(), protect, adminOnly, moderateReview);

router.patch("/:id/reply", validateObjectId(), protect, adminOnly, replyToReview);

router.delete("/:id", validateObjectId(), protect, adminOnly, deleteReview);

export default router;
