import crypto from "crypto";
import User from "../models/Users.js";

export const updateGuestProfile = async (req, res) => {
    try {
        const { name, email } = req.body;

        const user = req.user;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Guest session not found",
            });
        }

        user.name = name?.trim() || user.name;
        user.email = email?.trim().toLowerCase() || user.email;

        user.role = "customer";

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile",
        });
    }
};



export const createGuestSession = async (req, res) => {
    try {
        let token = req.cookies?.guestToken;

        if (token) {
            const user = await User.findOne({
                sessionToken: token,
                sessionExpiresAt: { $gt: new Date() },
            });

            if (user) {
                user.lastSeenAt = new Date();
                await user.save();

                return res.status(200).json({
                    success: true,
                    data: user,
                });
            }
        }

        const guest = await User.create({
            userId: `USR-${Date.now()}`,
            name: "Guest",
            role: "guest",
            sessionToken: crypto.randomUUID(),
            sessionExpiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        });

        res.cookie("guestToken", guest.sessionToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            data: guest,
        });
    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to create guest session",
        });
    }
};