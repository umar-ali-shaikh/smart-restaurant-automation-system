import express from "express";
import {
  createStaff,
  deleteStaff,
  getStaff,
  updateStaff,
  updateStaffStatus,
} from "../controllers/staffController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/", getStaff);
router.post("/", createStaff);
router.put("/:id", updateStaff);
router.patch("/:id/status", updateStaffStatus);
router.delete("/:id", deleteStaff);

export default router;
