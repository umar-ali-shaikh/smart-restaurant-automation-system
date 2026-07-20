import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    },

    type: {
        type: String,
        enum: ["veg", "nonveg"],
        required: true,
    },

    image: String,

    imagePublicId: {
        type: String,
        default: "",
    },

    isAvailable: {
        type: Boolean,
        default: true,
    },

    isChefSpecial: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });

export default mongoose.model("MenuItem", menuItemSchema);
