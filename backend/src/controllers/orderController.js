import MenuItem from "../models/MenuItem.js";
import Order from "../models/Order.js";
import mongoose from "mongoose";

async function populateOrder(order) {
  return order.populate([
    { path: "items.menuItem" },
    { path: "user", select: "employeeId email role" },
  ]);
}


export const createOrder = async (req, res) => {
  try {
    const { items = [], note = "", tableNo } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one menu item is required.",
      });
    }

    // Validate IDs
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.menuItem)) {
        return res.status(400).json({
          success: false,
          message: "Invalid menu item.",
        });
      }
    }

    // Fetch all menu items in one query
    const menuItems = await MenuItem.find({
      _id: {
        $in: items.map((item) => item.menuItem),
      },
    });

    const menuMap = new Map(
      menuItems.map((item) => [item._id.toString(), item])
    );

    let totalPrice = 0;

    const orderItems = [];

    for (const item of items) {
      const menu = menuMap.get(item.menuItem.toString());

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found.",
        });
      }

      if (!menu.isAvailable) {
        return res.status(400).json({
          success: false,
          message: `${menu.name} is currently unavailable.`,
        });
      }

      const quantity = Number(item.quantity) || 1;

      totalPrice += menu.price * quantity;

      orderItems.push({
        menuItem: menu._id,
        quantity,
        price: menu.price,
      });
    }

    const order = await Order.create({
      user: req.user?._id,
      tableNo,
      note: note.trim(),
      items: orderItems,
      totalPrice,
    });

    const populatedOrder = await populateOrder(order);

    const io = req.app.get("io");

    if (io) {
      io.to("adminRoom").emit("newOrder", populatedOrder);
      io.to(`order:${order._id}`).emit("orderUpdated", populatedOrder);
    }

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: populatedOrder,
    });
  } catch (error) {
    console.error("Create Order Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create order.",
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.menuItem")
      .populate("user", "userId name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ success: false, message: "Guest session not found" });
    }

    const orders = await Order.find({ user: req.user._id })
      .populate("items.menuItem")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.menuItem")
      .populate("user", "userId name email role")

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatus = ["pending", "preparing", "ready", "served"];

    if (!validStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const order = await Order.findById(req.params.id)
      .populate("items.menuItem")
      .populate("user", "userId name email role");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    order.status = status;
    await order.save();

    const io = req.app.get("io");

    console.log("====================================");
    console.log("✅ Status Updated:", order.status);
    console.log("📦 Order ID:", order._id.toString());
    console.log("👤 User ID:", order.user?._id?.toString() || "No User");
    console.log("📡 Emitting to room: adminRoom");
    console.log("📡 Emitting to room: order:" + order._id);

    if (order.user?._id) {
      console.log("📡 Emitting to user room:", order.user._id.toString());
      io.to(order.user._id.toString()).emit("orderUpdated", order);
    }

    io.to(`order:${order._id}`).emit("orderUpdated", order);
    io.to("adminRoom").emit("orderUpdated", order);

    console.log("✅ orderUpdated emitted successfully");
    console.log("====================================");

    res.json({
      success: true,
      message: "Order status updated",
      data: order,
      order,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await order.deleteOne();

    const io = req.app.get("io");
    io.to("adminRoom").emit("orderDeleted", { id: req.params.id });
    io.to(`order:${req.params.id}`).emit("orderDeleted", { id: req.params.id });

    res.json({
      success: true,
      message: "Order deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderBill = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("items.menuItem");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const billItems = order.items.map((item) => ({
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
      total: item.menuItem.price * item.quantity,
    }));

    const totalAmount = billItems.reduce((acc, item) => acc + item.total, 0);
    const bill = {
      table: order.tableNo,
      items: billItems,
      totalAmount,
      status: order.status,
    };

    res.json({
      success: true,
      data: bill,
      ...bill,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
