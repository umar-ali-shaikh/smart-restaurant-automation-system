import mongoose from "mongoose";

const tableSessionSchema = new mongoose.Schema(
  {
    table: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    startedAt: {
      type: Date,
      default: Date.now,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    lastActivityAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    totalRevenue: {
      type: Number,
      default: 0,
      min: 0,
    },

    orderCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    socketId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("TableSession", tableSessionSchema);
