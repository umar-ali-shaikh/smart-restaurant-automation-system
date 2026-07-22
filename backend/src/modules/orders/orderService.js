import mongoose from "mongoose";
import MenuItem from "../../models/MenuItem.js";
import Order from "../../models/Order.js";
import { ORDER_STATUSES } from "./orderPolicy.js";

function normalizeItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    const error = new Error("At least one menu item is required.");
    error.statusCode = 400;
    throw error;
  }

  return items.map((item) => {
    const menuItemId = item.menuItem || item.productId || item.id || item._id;
    if (!mongoose.Types.ObjectId.isValid(menuItemId)) {
      const error = new Error("Invalid menu item.");
      error.statusCode = 400;
      throw error;
    }

    const quantity = Number(item.quantity ?? item.qty);
    if (!Number.isInteger(quantity) || quantity < 1 || quantity > 100) {
      const error = new Error("Quantity must be an integer between 1 and 100.");
      error.statusCode = 400;
      throw error;
    }

    return { menuItemId, quantity };
  });
}

async function populateOrder(order) {
  return order.populate([
    { path: "items.menuItem" },
    { path: "user", select: "userId name employeeId email role" },
  ]);
}

export async function createOrder({ guestId, payload }) {
  const requestedItems = normalizeItems(payload.items);
  const menuItems = await MenuItem.find({
    _id: { $in: requestedItems.map((item) => item.menuItemId) },
    isAvailable: true,
  });
  const menuMap = new Map(menuItems.map((item) => [item._id.toString(), item]));

  const orderItems = [];
  let totalPrice = 0;

  for (const requested of requestedItems) {
    const menu = menuMap.get(requested.menuItemId.toString());
    if (!menu) {
      const error = new Error("Menu item not found or unavailable.");
      error.statusCode = 404;
      throw error;
    }

    totalPrice += menu.price * requested.quantity;
    orderItems.push({
      menuItem: menu._id,
      quantity: requested.quantity,
      price: menu.price,
    });
  }

  const order = await Order.create({
    user: guestId,
    tableNo: payload.tableNo,
    note: String(payload.note || "").trim().slice(0, 500),
    items: orderItems,
    totalPrice,
  });

  return populateOrder(order);
}

export function listOrders() {
  return Order.find()
    .populate("items.menuItem")
    .populate("user", "userId name email role")
    .sort({ createdAt: -1 });
}

export function listGuestOrders(guestId) {
  return Order.find({ user: guestId })
    .populate("items.menuItem")
    .sort({ createdAt: -1 });
}

export function findOrderById(orderId) {
  return Order.findById(orderId)
    .populate("items.menuItem")
    .populate("user", "userId name email role");
}

export function updateOrderStatus(orderId, status) {
  if (!ORDER_STATUSES.includes(status)) {
    const error = new Error("Invalid status");
    error.statusCode = 400;
    throw error;
  }

  return Order.findByIdAndUpdate(orderId, { status }, { new: true, runValidators: true })
    .populate("items.menuItem")
    .populate("user", "userId name email role");
}

export function deleteOrder(orderId) {
  return Order.findByIdAndDelete(orderId);
}

export async function buildOrderBill(orderId) {
  const order = await Order.findById(orderId).populate("items.menuItem");
  if (!order) return null;

  const items = order.items.map((item) => ({
    name: item.menuItem?.name || "Unavailable item",
    price: item.price,
    quantity: item.quantity,
    total: item.price * item.quantity,
  }));

  return {
    order,
    bill: {
      table: order.tableNo,
      items,
    totalAmount: items.reduce((total, item) => total + item.total, 0),
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    transactionId: order.transactionId,
    paidAt: order.paidAt,
    paymentNotes: order.paymentNotes,
  },
  };
}
