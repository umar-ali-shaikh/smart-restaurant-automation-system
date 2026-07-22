import express from "express";
import {
  createStaff,
  deleteStaff,
  getStaff,
  updateStaff,
  updateStaffStatus,
} from "../controllers/staffController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getStaff);
router.post("/", createStaff);
router.put("/:id", validateObjectId(), updateStaff);
router.patch("/:id/status", validateObjectId(), updateStaffStatus);
router.delete("/:id", validateObjectId(), deleteStaff);

export default router;
