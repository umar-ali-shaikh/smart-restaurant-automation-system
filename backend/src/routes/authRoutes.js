import express from "express";
import { adminLogin, kitchenLogin, getCurrentUser, logout, refreshSession } from "../controllers/authController.js";
import { requireStaffAuth } from "../middleware/authMiddleware.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { adminLoginSchema, kitchenLoginSchema } from "../shared/validation/schemas.js";
const router = express.Router();


router.post("/admin/login", authLimiter, validateRequest({ body: adminLoginSchema }), adminLogin);
router.post("/kitchen/login", authLimiter, validateRequest({ body: kitchenLoginSchema }), kitchenLogin);
router.get("/me", requireStaffAuth, getCurrentUser);
router.post("/refresh", requireStaffAuth, refreshSession);
router.post("/logout", requireStaffAuth, logout);

export default router;
