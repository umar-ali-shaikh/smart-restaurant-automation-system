import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  getOrderBill,
} from "../controllers/orderController.js";

import {
  protect,
  rolesAllowed,
  optionalProtect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/* ===========================
   PUBLIC (TOKEN OPTIONAL)
=========================== */

// Customer can place order without login
router.post("/", optionalProtect, createOrder);

// Guest session orders. This must be registered before `/:id`.
router.get("/my", optionalProtect, getMyOrders);

// Customer/Admin can view bill
router.get("/:id/bill", optionalProtect, getOrderBill);

// Customer/Admin can view single order
router.get("/:id", optionalProtect, getOrderById);

/* ===========================
   PROTECTED
=========================== */

// Admin / Kitchen
router.get("/", protect, rolesAllowed("admin", "kitchen"), getOrders);

router.put(
  "/:id",
  protect,
  rolesAllowed("admin", "kitchen"),
  updateOrderStatus
);

// Admin only
router.delete(
  "/:id",
  protect,
  rolesAllowed("admin"),
  deleteOrder
);

export default router;
