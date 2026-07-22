import mongoose from "mongoose";
import {
  buildOrderBill,
  createOrder as createOrderService,
  deleteOrder as deleteOrderService,
  findOrderById,
  listGuestOrders,
  listOrders,
  updateOrderStatus as updateOrderStatusService,
} from "../modules/orders/orderService.js";
import { canAccessOrder } from "../modules/orders/orderPolicy.js";

function sendServiceError(res, error) {
  const status = error.statusCode || (error instanceof mongoose.Error.CastError ? 400 : 500);
  return res.status(status).json({ success: false, message: status === 500 ? "Unable to process order" : error.message });
}

export const createOrder = async (req, res) => {
  try {
    const order = await createOrderService({ guestId: req.guest._id, payload: req.body });
    const io = req.app.get("io");
    if (io) {
      io.to("operationsRoom").emit("newOrder", order);
      io.to(`order:${order._id}`).emit("orderUpdated", order);
    }

    return res.status(201).json({ success: true, message: "Order created successfully.", data: order });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

export const getOrders = async (req, res) => {
  try {
    return res.json({ success: true, data: await listOrders() });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

export const getMyOrders = async (req, res) => {
  try {
    return res.json({ success: true, data: await listGuestOrders(req.guest._id) });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await findOrderById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    if (!canAccessOrder(order, { staff: req.user, guest: req.guest })) {
      return res.status(403).json({ success: false, message: "You cannot access this order" });
    }
    return res.json({ success: true, data: order });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await updateOrderStatusService(req.params.id, req.body.status);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const io = req.app.get("io");
    if (io) {
      if (order.user?._id) io.to(order.user._id.toString()).emit("orderUpdated", order);
      io.to(`order:${order._id}`).emit("orderUpdated", order);
      io.to("operationsRoom").emit("orderUpdated", order);
    }

    return res.json({ success: true, message: "Order status updated", data: order, order });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const order = await deleteOrderService(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    const io = req.app.get("io");
    if (io) {
      io.to("operationsRoom").emit("orderDeleted", { id: req.params.id });
      io.to(`order:${req.params.id}`).emit("orderDeleted", { id: req.params.id });
    }

    return res.json({ success: true, message: "Order deleted" });
  } catch (error) {
    return sendServiceError(res, error);
  }
};

export const getOrderBill = async (req, res) => {
  try {
    const result = await buildOrderBill(req.params.id);
    if (!result) return res.status(404).json({ success: false, message: "Order not found" });
    if (!canAccessOrder(result.order, { staff: req.user, guest: req.guest })) {
      return res.status(403).json({ success: false, message: "You cannot access this bill" });
    }

    return res.json({ success: true, data: result.bill, ...result.bill });
  } catch (error) {
    return sendServiceError(res, error);
  }
};
