import express from "express";
import {
  createGuestSession,
  updateGuestProfile,
} from "../controllers/userController.js";

import { requireGuestAuth } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Create or restore guest session
userRouter.get("/session", createGuestSession);

// Update guest to customer
userRouter.put("/profile", requireGuestAuth, updateGuestProfile);

export default userRouter;
