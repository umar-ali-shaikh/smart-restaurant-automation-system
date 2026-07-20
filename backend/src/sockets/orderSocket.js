import { Server } from "socket.io";
import Table from "../models/Table.js"; // Sahi path match kar diya hai schema ke mutabik

let io;
const tableTimeouts = {}; // Active 10-minute countdowns ko track karne ke liye tracking global instance

export const initSocket = (server) => {
  const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim());

  io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("✅ SOCKET CONNECTED:", socket.id);

    // ======================================
    //     DEFAULT CHANNELS LOGIC
    // ======================================
    socket.on("joinAdmin", () => {
      socket.join("adminRoom");
    });

    socket.on("joinUser", (userId) => {
      if (userId) socket.join(userId);
    });

    socket.on("joinOrder", (orderId) => {
      if (orderId) socket.join(`order:${orderId}`);
    });

    socket.on("leaveOrder", (orderId) => {
      if (orderId) socket.leave(`order:${orderId}`);
    });

    // ======================================
    // 🔥 NEW: DYNAMIC TABLE PRESENCE CONTROLLER
    // ======================================
    socket.on("joinTable", async ({ tableNumber }) => {
      socket.tableNumber = tableNumber;
      console.log(`📡 Customer active stream established on Table #${tableNumber}`);

      // Agar is table ka pehle se koi 10-minute countdown chal raha tha, toh use cancel kar do
      if (tableTimeouts[tableNumber]) {
        clearTimeout(tableTimeouts[tableNumber]);
        delete tableTimeouts[tableNumber];
        console.log(`⏰ Inactivity timeout cleared for Table #${tableNumber} (Customer re-engaged)`);
      }

      try {
        // Table ko instantly Occupied mark karo database mein
        const table = await Table.findOneAndUpdate(
          { tableNumber: parseInt(tableNumber, 10) },
          { status: "Occupied" },
          { new: true }
        );

        if (table) {
          // Pure network par broadcast event emit karo admin updates sync karne ke liye
          io.emit("tableUpdated", { tableNumber: table.tableNumber, status: "Occupied", data: table });
        }
      } catch (err) {
        console.error("Error updates table buffer on joinTable socket event:", err);
      }
    });

    // ======================================
    // 🔥 NEW: DISCONNECT PRESENCE COUNTDOWN
    // ======================================
    socket.on("disconnect", () => {
      const tableNumber = socket.tableNumber;
      if (!tableNumber) return;

      console.log(`🔌 User disconnected from Table #${tableNumber}. 10-Minute countdown activated...`);

      // 10 Minutes Timer Initialization -> (10 mins * 60 secs * 1000 ms)
      tableTimeouts[tableNumber] = setTimeout(async () => {
        try {
          const table = await Table.findOneAndUpdate(
            { tableNumber: parseInt(tableNumber, 10) },
            { status: "Available" },
            { new: true }
          );

          if (table) {
            io.emit("tableUpdated", { tableNumber: table.tableNumber, status: "Available", data: table });
            console.log(`⏰ Table #${tableNumber} auto-released successfully due to 10 minutes inactivity.`);
          }
          delete tableTimeouts[tableNumber];
        } catch (err) {
          console.error("Error dynamic auto-releasing inactive table indices:", err);
        }
      }, 10 * 60 * 1000);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};