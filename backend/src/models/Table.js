import mongoose from "mongoose";

const tableSchema = new mongoose.Schema(
    {
        tableNumber: {
            type: Number,
            required: true,
            unique: true,
        },

        capacity: {
            type: Number,
            required: true,
            default: 4,
        },

        status: {
            type: String,
            enum: ["Available", "Occupied", "Reserved", "Cleaning"],
            default: "Available",
        },

        currentSession: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TableSession",
            default: null,
        },

        currentOrder: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            default: null,
        },

        occupiedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            default: null,
        },

        occupiedAt: {
            type: Date,
            default: null,
        },

        qrCode: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Table", tableSchema);