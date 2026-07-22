import { io } from "socket.io-client";
import { SOCKET_URL } from "./apiConfig";

let socket;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: true,
      transports: ["polling", "websocket"],
      withCredentials: true,
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
