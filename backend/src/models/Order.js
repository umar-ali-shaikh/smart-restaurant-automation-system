import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ Changed from Admin
      required: true,
    },

    tableNo: {
      type: Number,
      default: null,
    },

    note: {
      type: String,
      trim: true,
      default: "",
    },

    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        price: {
          type: Number,
          required: true,
        },
      },
    ],

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "preparing", "ready", "served", "cancelled"],
      default: "pending",
    },

    paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending", index: true },
    paymentMethod: { type: String, enum: ["Cash", "UPI", "Card", "Wallet", "Split Payment"], default: null },
    transactionId: { type: String, trim: true, index: true, default: null },
    paidAt: { type: Date, default: null },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", default: null },
    paymentNotes: { type: String, trim: true, maxlength: 500, default: "" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Customer history, operational queues, and table reporting use these access paths.
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ tableNo: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
