import { io } from "socket.io-client";
import { SOCKET_URL } from "./apiConfig";
import { getAuthToken } from "./client";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,

      // websocket force mat karo
      transports: ["polling", "websocket"],

      auth: {
        token: getAuthToken(),
      },
    });

    socket.on("connect", () => {
      console.log("✅ SOCKET CONNECTED");
      console.log("Socket ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ SOCKET ERROR");
      console.log(err);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 SOCKET DISCONNECTED");
      console.log(reason);
    });
  }

  return socket;
}

export function connectSocket() {
  return getSocket();
}

export function disconnectSocket() {
  socket?.disconnect();
}