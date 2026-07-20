import express from "express";
import {
  createGuestSession,
  updateGuestProfile,
} from "../controllers/userController.js";

import { optionalProtect } from "../middleware/authMiddleware.js";

const userRouter = express.Router();

// Create or restore guest session
userRouter.get("/session", createGuestSession);

// Update guest to customer
userRouter.put("/profile", optionalProtect, updateGuestProfile);

export default userRouter;