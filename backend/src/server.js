import "./config/env.js";

console.log("SERVER ENV", process.env.CLOUDINARY_API_KEY);

import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dns.setDefaultResultOrder("ipv4first");

import cors from "cors";
import express from "express";
import http from "http";

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
// 🔥 1. CREATE APP FIRST
const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));


// 🔥 2. CREATE SERVER
const server = http.createServer(app);

// 🔥 3. INIT SOCKET
const io = initSocket(server);
app.set("io", io);

// DB connect
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
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
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
