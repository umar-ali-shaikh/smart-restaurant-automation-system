const DEFAULT_CLIENT_ORIGIN = "http://localhost:5173";

export function getAllowedOrigins() {
  return (process.env.CLIENT_URL || DEFAULT_CLIENT_ORIGIN)
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);
}

export function isAllowedOrigin(origin, callback) {
  // Requests without an Origin header include health checks and server-to-server calls.
  if (!origin || getAllowedOrigins().includes(origin.replace(/\/$/, ""))) {
    return callback(null, true);
  }

  return callback(new Error("Origin is not allowed by CORS"));
}
