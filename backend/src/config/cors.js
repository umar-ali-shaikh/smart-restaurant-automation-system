const DEFAULT_CLIENT_ORIGIN = "http://localhost:5173";

export function getAllowedOrigins() {
  return (process.env.CLIENT_URL || DEFAULT_CLIENT_ORIGIN)
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export function isTrustedOrigin(origin) {
  return Boolean(origin && getAllowedOrigins().includes(origin.replace(/\/$/, "")));
}

export function isAllowedOrigin(origin, callback) {
  // Requests without an Origin header include health checks and server-to-server calls.
  if (!origin || isTrustedOrigin(origin)) {
    return callback(null, true);
  }

  return callback(new Error("Origin is not allowed by CORS"));
}
