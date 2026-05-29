import { io, Socket } from "socket.io-client";
import { SOCKET_EVENT } from "./socketEvents";

const SOCKET_URL = "http://localhost:3000";

let socket: Socket | null = null;

export function connectSocket(userId: string): Socket {
  if (socket?.connected) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
  });

  socket.on("connect", () => {
    socket?.emit(SOCKET_EVENT.USER_REGISTER, { userId });
  });

  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket(): Socket | null {
  return socket;
}
