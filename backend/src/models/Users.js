import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
            index: true,
        },

        name: {
            type: String,
            trim: true,
            default: "Guest",
            maxlength: 100,
        },

        email: {
            type: String,
            trim: true,
            lowercase: true,
            sparse: true, // Allows multiple users without email
            default: undefined,
        },

        role: {
            type: String,
            enum: ["guest", "customer"],
            default: "guest",
            index: true,
        },

        sessionToken: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        // Don't use index:true here because TTL index is defined below
        sessionExpiresAt: {
            type: Date,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
            index: true,
        },

        lastSeenAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// TTL Index (MongoDB automatically deletes expired guest sessions)
userSchema.index(
    { sessionExpiresAt: 1 },
    { expireAfterSeconds: 0 }
);

export default mongoose.model("User", userSchema);