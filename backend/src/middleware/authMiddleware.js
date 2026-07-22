import Admin from "../models/Admin.js";
import User from "../models/Users.js";
import {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  verifySessionToken,
} from "../config/auth.js";
import jwt from "jsonwebtoken";
import { validateAuthConfiguration } from "../config/auth.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const payload = verifySessionToken(token);

    const user = await Admin.findOne({
      _id: payload.sub,
      sessionToken: payload.sid,
      sessionExpiresAt: { $gt: new Date() },
    }).select("+sessionToken +sessionExpiresAt");

    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    clearAuthCookie(res);
    res.status(401).json({ message: "Session expired. Please login again." });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }

  return res.status(403).json({ message: "Admin access only" });
};

export const rolesAllowed = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) {
    return next();
  }

  return res.status(403).json({ message: "Access denied" });
};





export const optionalProtect = async (req, res, next) => {
  try {
    // 1. Logged-in user
    const authToken = req.cookies?.[AUTH_COOKIE_NAME];

    console.log("Cookies:", req.cookies);
    console.log("Auth Token:", authToken);

    if (authToken) {
      try {
        const payload = jwt.verify(authToken, validateAuthConfiguration());
        console.log("JWT Payload:", payload);

        const user = await User.findById(payload.sub);
        console.log("User:", user?._id);

        if (user) {
          req.user = user;
          return next();
        }
      } catch (err) {
        console.error("JWT Verify Error:", err.message);
      }
    }

    // 2. Guest user
    const guestToken = req.cookies?.guestToken;

    if (guestToken) {
      const guest = await User.findOne({
        sessionToken: guestToken,
        sessionExpiresAt: { $gt: new Date() },
      });

      if (guest) {
        guest.lastSeenAt = new Date();
        await guest.save();

        req.user = guest;
        return next();
      }
    }

    req.user = null;
    next();
  } catch (error) {
    next(error);
  }
};
