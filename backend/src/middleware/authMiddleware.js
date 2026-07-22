import Admin from "../models/Admin.js";
import User from "../models/Users.js";
import {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  verifySessionToken,
} from "../config/auth.js";

async function findStaffSession(token) {
  const payload = verifySessionToken(token);

  const user = await Admin.findOne({
    _id: payload.sub,
    sessionToken: payload.sid,
    sessionExpiresAt: { $gt: new Date() },
  }).select("+sessionToken +sessionExpiresAt");

  return user;
}

async function findGuestSession(token) {
  return User.findOne({
    sessionToken: token,
    sessionExpiresAt: { $gt: new Date() },
    isActive: true,
  });
}

export const requireStaffAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.[AUTH_COOKIE_NAME];
    if (!token) return res.status(401).json({ message: "Staff authentication is required" });

    const user = await findStaffSession(token);
    if (!user) {
      clearAuthCookie(res);
      return res.status(401).json({ message: "Session expired. Please login again." });
    }

    req.user = user;
    return next();
  } catch {
    clearAuthCookie(res);
    return res.status(401).json({ message: "Session expired. Please login again." });
  }
};

export const optionalStaffAuth = async (req, res, next) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME];
  if (!token) return next();

  try {
    const user = await findStaffSession(token);
    if (user) req.user = user;
    else clearAuthCookie(res);
  } catch {
    clearAuthCookie(res);
  }

  return next();
};

export const requireGuestAuth = async (req, res, next) => {
  const token = req.cookies?.guestToken;
  if (!token) return res.status(401).json({ success: false, message: "Guest session is required" });

  try {
    const guest = await findGuestSession(token);
    if (!guest) return res.status(401).json({ success: false, message: "Guest session expired" });

    guest.lastSeenAt = new Date();
    await guest.save();
    req.guest = guest;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const requireActorAuth = async (req, res, next) => {
  const staffToken = req.cookies?.[AUTH_COOKIE_NAME];
  if (staffToken) {
    try {
      const user = await findStaffSession(staffToken);
      if (user) {
        req.user = user;
        return next();
      }
      clearAuthCookie(res);
    } catch {
      clearAuthCookie(res);
    }
  }

  return requireGuestAuth(req, res, next);
};

export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") return next();
  return res.status(403).json({ message: "Admin access only" });
};

export const rolesAllowed = (...roles) => (req, res, next) => {
  if (req.user && roles.includes(req.user.role)) return next();
  return res.status(403).json({ message: "Access denied" });
};

// Temporary compatibility aliases while routes are migrated to explicit names.
export const protect = requireStaffAuth;
export const optionalProtect = optionalStaffAuth;
