import { recordPayment } from "../modules/orders/paymentService.js";

export async function payOrder(req, res, next) {
  try {
    const order = await recordPayment({ orderId: req.params.id, payment: req.body, cashierId: req.user._id, io: req.app.get("io") });
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });
    return res.json({ success: true, message: "Payment recorded successfully", data: order });
  } catch (error) {
    return next(error);
  }
}
