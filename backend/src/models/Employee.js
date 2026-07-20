import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const kitchenSchema = new mongoose.Schema(
    {
        name: String,
        employeeId: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        color: {
            type: String,
            default: "",
        },
        online: {
            type: Boolean,
            default: false,
        },
        sessionToken: {
            type: String,
            default: "",
            select: false,
        },
        sessionExpiresAt: {
            type: Date,
            default: null,
            select: false,
        },
    },
    { timestamps: true }
);

kitchenSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
});

kitchenSchema.methods.matchPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model("Kitchen", kitchenSchema);