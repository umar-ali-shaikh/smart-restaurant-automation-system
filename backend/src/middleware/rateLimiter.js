import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import Redis from "ioredis";

const redis = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, { lazyConnect: true, maxRetriesPerRequest: 1 })
  : null;

if (redis) {
  redis.on("error", (error) => {
    console.error("Rate-limit Redis error:", error.message);
  });
}

function createLimiter({ windowMs, max, message, scope }) {
  const store = redis
    ? new RedisStore({
      prefix: `restaurant:rate-limit:${scope}:`,
      sendCommand: (...args) => redis.call(...args),
    })
    : undefined;

  return rateLimit({
    windowMs,
    max,
    ...(store ? { store } : {}),
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
}

export const globalLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests, please try again later",
  scope: "global",
});

export const authLimiter = createLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, try again later",
  scope: "auth",
});

export const orderLimiter = createLimiter({
  windowMs: 10 * 60 * 1000,
  max: 50,
  message: "Too many order requests, slow down",
  scope: "orders",
});
