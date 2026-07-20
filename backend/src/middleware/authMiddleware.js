import Admin from "../models/Admin.js";
import User from "../models/Users.js";
import crypto from "crypto";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const token = authHeader.split(" ")[1];

    console.log("TOKEN FROM REQUEST:", token);

    const user = await Admin.findOne({
      sessionToken: token,
      sessionExpiresAt: { $gt: new Date() },
    }).select("+sessionToken +sessionExpiresAt");

    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: error.message });
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
    const token =
      req.cookies?.guestToken ||
      req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      req.user = null;
      return next();
    }

    const user = await User.findOne({
      sessionToken: token,
      sessionExpiresAt: { $gt: new Date() },
    });

    if (user) {
      user.lastSeenAt = new Date();
      await user.save();

      req.user = user;
    } else {
      req.user = null;
    }

    next();
  } catch (error) {
    next(error);
  }
};