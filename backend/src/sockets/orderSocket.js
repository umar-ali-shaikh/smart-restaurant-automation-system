import { Server } from "socket.io";
import Admin from "../models/Admin.js";
import Order from "../models/Order.js";
import User from "../models/Users.js";
import { isAllowedOrigin, isTrustedOrigin } from "../config/cors.js";
import { AUTH_COOKIE_NAME, verifySessionToken } from "../config/auth.js";

let io;

function readCookies(cookieHeader = "") {
  return cookieHeader.split(";").reduce((cookies, entry) => {
    const [name, ...value] = entry.trim().split("=");
    if (name) cookies[name] = decodeURIComponent(value.join("="));
    return cookies;
  }, {});
}

async function attachActor(socket) {
  const cookies = readCookies(socket.request.headers.cookie);
  const authToken = cookies[AUTH_COOKIE_NAME];

  if (authToken) {
    try {
      const payload = verifySessionToken(authToken);
      const staff = await Admin.findOne({
        _id: payload.sub,
        sessionToken: payload.sid,
        sessionExpiresAt: { $gt: new Date() },
      }).select("_id role");

      if (staff) {
        socket.data.staff = staff;
        return;
      }
    } catch {
      // An invalid staff cookie does not prevent public customer socket usage.
    }
  }

  if (cookies.guestToken) {
    const guest = await User.findOne({
      sessionToken: cookies.guestToken,
      sessionExpiresAt: { $gt: new Date() },
      isActive: true,
    }).select("_id");

    if (guest) socket.data.guest = guest;
  }
}

function isOperationsStaff(socket) {
  return ["admin", "kitchen"].includes(socket.data.staff?.role);
}

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: isAllowedOrigin, credentials: true },
    allowRequest: (request, callback) => {
      const origin = request.headers.origin;
      callback(null, !origin || isTrustedOrigin(origin));
    },
  });

  io.use(async (socket, next) => {
    try {
      await attachActor(socket);
      next();
    } catch (error) {
      next(error);
    }
  });

  io.on("connection", (socket) => {
    socket.on("joinAdmin", () => {
      if (socket.data.staff?.role === "admin") socket.join("adminRoom");
    });

    socket.on("joinOperations", () => {
      if (isOperationsStaff(socket)) socket.join("operationsRoom");
    });

    socket.on("joinOrder", async (orderId) => {
      if (!isOperationsStaff(socket) && !socket.data.guest) return;

      const order = await Order.findById(orderId).select("user");
      if (!order) return;

      const isOwner = order.user.toString() === socket.data.guest?._id?.toString();
      if (isOperationsStaff(socket) || isOwner) socket.join(`order:${orderId}`);
    });

    socket.on("leaveOrder", (orderId) => socket.leave(`order:${orderId}`));

    socket.on("joinTable", ({ tableNumber } = {}) => {
      if (!socket.data.guest || !Number.isInteger(Number(tableNumber))) return;
      socket.join(`table:${Number(tableNumber)}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
