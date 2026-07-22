import Order from "../../models/Order.js";
import Table from "../../models/Table.js";
import TableSession from "../../models/TableSession.js";

const METHODS = new Set(["Cash", "UPI", "Card", "Wallet", "Split Payment"]);

export async function recordPayment({ orderId, payment, cashierId, io }) {
  if (!METHODS.has(payment.paymentMethod)) {
    const error = new Error("Unsupported payment method");
    error.statusCode = 400;
    throw error;
  }
  const order = await Order.findById(orderId);
  if (!order) return null;
  if (order.paymentStatus === "Paid") {
    const error = new Error("Order is already paid");
    error.statusCode = 409;
    throw error;
  }
  order.paymentStatus = payment.paymentStatus || "Paid";
  order.paymentMethod = payment.paymentMethod;
  order.transactionId = payment.transactionId?.trim() || `TXN-${Date.now()}-${order._id.toString().slice(-6)}`;
  order.paymentNotes = payment.paymentNotes?.trim() || "";
  order.cashier = cashierId;
  order.paidAt = order.paymentStatus === "Paid" ? new Date() : null;
  await order.save();

  if (order.paymentStatus === "Paid" && order.tableNo != null) {
    const table = await Table.findOne({ tableNumber: order.tableNo, occupiedBy: order.user });
    if (table) {
      if (table.currentSession) await TableSession.findByIdAndUpdate(table.currentSession, { isActive: false, endedAt: new Date(), lastSeen: new Date(), lastActivityAt: new Date(), totalRevenue: order.totalPrice, orderCount: 1 });
      table.status = "Available";
      table.currentSession = null;
      table.currentOrder = null;
      table.occupiedBy = null;
      table.occupiedAt = null;
      await table.save();
      io?.to("adminRoom").emit("paymentCompleted", { orderId: order._id, tableNumber: table.tableNumber, data: table });
      io?.to("adminRoom").emit("tableUpdated", { tableNumber: table.tableNumber, status: "Available", data: table });
    }
  }
  return order.populate([{ path: "items.menuItem" }, { path: "user", select: "userId name email role" }]);
}
