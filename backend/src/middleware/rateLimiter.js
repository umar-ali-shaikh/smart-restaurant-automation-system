import rateLimit from "express-rate-limit";

// 🔹 Global limiter (for all APIs)
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // max 100 requests per IP
    message: {
        success: false,
        message: "Too many requests, please try again later",
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// 🔹 Strict limiter (for auth routes)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5, // only 5 login/register attempts
    message: {
        success: false,
        message: "Too many login attempts, try again later",
    },
});

// 🔹 Medium limiter (for orders)
export const orderLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 50,
    message: {
        success: false,
        message: "Too many orders requests, slow down",
    },
});
