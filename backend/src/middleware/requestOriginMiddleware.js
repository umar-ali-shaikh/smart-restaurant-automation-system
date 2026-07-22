import { isTrustedOrigin } from "../config/cors.js";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

// Cookie-authenticated browser requests need an explicit trusted Origin check.
// This protects state-changing endpoints even when SameSite=None is required for Vercel → Render.
export function requireTrustedOrigin(req, res, next) {
  if (SAFE_METHODS.has(req.method)) return next();

  const origin = req.get("origin");
  if (!isTrustedOrigin(origin)) {
    return res.status(403).json({
      success: false,
      message: "Request origin is not allowed",
    });
  }

  return next();
}
