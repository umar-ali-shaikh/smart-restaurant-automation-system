import "./config/env.js";

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import cors from "cors";
import express from "express";
import http from "http";
import helmet from "helmet";
import mongoose from "mongoose";
import crypto from "node:crypto";
import pinoHttp from "pino-http";

import connectDB from "./config/db.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { protect } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { initSocket } from "./sockets/orderSocket.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import staffRoutes from "./routes/staffRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import { isAllowedOrigin } from "./config/cors.js";
import { validateAuthConfiguration } from "./config/auth.js";
import { requireTrustedOrigin } from "./middleware/requestOriginMiddleware.js";
import healthRoutes from "./routes/healthRoutes.js";
// 🔥 1. CREATE APP FIRST
const app = express();
validateAuthConfiguration();

// Render terminates TLS at its proxy; this lets Express handle secure cookies correctly.
app.set("trust proxy", 1);

app.use(pinoHttp({
  genReqId: (req) => req.headers["x-request-id"] || crypto.randomUUID(),
  customProps: (req) => ({ environment: process.env.NODE_ENV || "development", ip: req.ip }),
  redact: ["req.headers.cookie", "req.headers.authorization"],
}));
app.use(helmet());
app.use(cors({
  origin: isAllowedOrigin,
  credentials: true,
}));


// 🔥 2. CREATE SERVER
const server = http.createServer(app);

// 🔥 3. INIT SOCKET
const io = initSocket(server);
app.set("io", io);

// Readiness is meaningful only after the initial database connection succeeds.
await connectDB();

// Middleware
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(requireTrustedOrigin);
app.use("/health", healthRoutes);
app.use(globalLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.send("API Running 🚀");
});

app.get("/api/protected", protect, (req, res) => {
  res.json({
    message: "Protected route",
    user: req.user,
  });
});

// Error middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`${signal} received; shutting down gracefully`);
  server.close(async () => {
    await mongoose.disconnect();
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
