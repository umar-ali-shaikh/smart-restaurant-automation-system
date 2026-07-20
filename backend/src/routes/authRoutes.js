import express from "express";
import { adminLogin, kitchenLogin, getCurrentUser, logout } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
const router = express.Router();


router.post("/admin/login", authLimiter, adminLogin);
router.post("/kitchen/login", authLimiter, kitchenLogin);
router.get("/me", protect, getCurrentUser);
router.post("/logout", protect, logout);

export default router;
