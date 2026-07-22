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
  requireActorAuth,
  requireGuestAuth,
  requireStaffAuth,
  rolesAllowed,
} from "../middleware/authMiddleware.js";
import { validateObjectId } from "../middleware/validateObjectId.js";
import { orderLimiter } from "../middleware/rateLimiter.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createOrderSchema, orderStatusSchema } from "../shared/validation/schemas.js";
import { paymentSchema } from "../shared/validation/paymentSchemas.js";
import { payOrder } from "../controllers/paymentController.js";

const router = express.Router();

/* ===========================
   PUBLIC (TOKEN OPTIONAL)
=========================== */

router.post("/", orderLimiter, validateRequest({ body: createOrderSchema }), requireGuestAuth, createOrder);

// Guest session orders. This must be registered before `/:id`.
router.get("/my", requireGuestAuth, getMyOrders);

// Customer/Admin can view bill
router.get("/:id/bill", validateObjectId(), requireActorAuth, getOrderBill);

// Customer/Admin can view single order
router.get("/:id", validateObjectId(), requireActorAuth, getOrderById);

/* ===========================
   PROTECTED
=========================== */

// Admin / Kitchen
router.get("/", requireStaffAuth, rolesAllowed("admin", "kitchen"), getOrders);

router.put(
  "/:id",
  requireStaffAuth,
  validateObjectId(),
  rolesAllowed("admin", "kitchen"),
  validateRequest({ body: orderStatusSchema }),
  updateOrderStatus
);

router.post(
  "/:id/payment",
  requireStaffAuth,
  validateObjectId(),
  rolesAllowed("admin"),
  validateRequest({ body: paymentSchema }),
  payOrder,
);

// Admin only
router.delete(
  "/:id",
  requireStaffAuth,
  validateObjectId(),
  rolesAllowed("admin"),
  deleteOrder
);

export default router;
