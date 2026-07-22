import crypto from "crypto";
import jwt from "jsonwebtoken";

export const AUTH_COOKIE_NAME = "authToken";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set in production");
  }

  if (process.env.NODE_ENV === "production" && secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters in production");
  }

  return secret || "development-only-secret-change-me";
}

export function validateAuthConfiguration() {
  getJwtSecret();
}

export function createSessionToken(user) {
  const sessionId = crypto.randomUUID();
  const token = jwt.sign(
    { sub: user._id.toString(), role: user.role, sid: sessionId },
    getJwtSecret(),
    {
      expiresIn: "7d",
      issuer: "restaurant-automation",
      audience: "restaurant-automation",
    },
  );

  return { token, sessionId };
}

export function verifySessionToken(token) {
  return jwt.verify(token, getJwtSecret(), {
    issuer: "restaurant-automation",
    audience: "restaurant-automation",
  });
}

export function authCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: SESSION_DURATION_MS,
    path: "/",
  };
}

export function clearAuthCookie(res) {
  const { maxAge, ...options } = authCookieOptions();
  res.clearCookie(AUTH_COOKIE_NAME, options);
}
