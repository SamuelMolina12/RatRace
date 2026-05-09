import { Server } from "socket.io";

export const onlineUsers = new Map<string, string>();

export const emitToUser = (
  io: Server,
  userId: string,
  event: string,
  payload: unknown
) => {
  const socketId = onlineUsers.get(userId);

  if (!socketId) {
    return;
  }

  io.to(socketId).emit(event, payload);
};

export const emitToUsers = (
  io: Server,
  userIds: string[],
  event: string,
  payload: unknown
) => {
  userIds.forEach((userId) => {
    emitToUser(io, userId, event, payload);
  });
};