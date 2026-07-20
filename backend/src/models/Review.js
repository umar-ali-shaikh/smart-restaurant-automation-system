import mongoose from "mongoose";

const reviewItemSchema = new mongoose.Schema(
  {
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
    },

    name: {
      type: String,
      trim: true,
      default: "",
    },

    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
  },
  {
    _id: false,
  }
);

const reviewSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      maxlength: 80,
      default: "Guest",
    },

    customerEmail: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    tableNo: {
      type: Number,
      min: 1,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      index: true,
    },
    menuItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 1200,
      default: "",
    },

    selectedItems: {
      type: [reviewItemSchema],
      default: [],
    },

    anonymous: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    // Admin Reply
    reply: {
      text: {
        type: String,
        trim: true,
        maxlength: 800,
      },

      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Admin",
      },

      repliedAt: Date,
    },

    // Soft Delete
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    deletedAt: Date,

    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound Indexes
reviewSchema.index({
  status: 1,
  createdAt: -1,
});

reviewSchema.index({
  rating: 1,
  createdAt: -1,
});

reviewSchema.index({
  orderId: 1,
  createdAt: -1,
});

reviewSchema.index({
  tableNo: 1,
  createdAt: -1,
});

export default mongoose.model("Review", reviewSchema);