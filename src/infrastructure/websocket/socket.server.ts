import { Server, Socket } from "socket.io";
import { ConversationMongoRepository } from "../database/mongo/repositories/conversation.mongo.repository";
import { MessageMongoRepository } from "../database/mongo/repositories/message.mongo.repository";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";
import { MarkMessagesAsReadUseCase } from "../../application/use-cases/chat/MarkMessagesAsReadUseCase";

const onlineUsers = new Map<string, string>();

interface RegisterUserPayload {
    userId: string;
}

interface SendMessagePayload {
    senderId: string;
    receiverId: string;
    content: string;
}

interface TypingPayload {
    senderId: string;
    receiverId: string;
}

interface ReadMessagesPayload {
    conversationId: string;
    receiverId: string;
    senderId: string;
}

export const initializeSocketServer = (io: Server) => {
    const conversationRepository = new ConversationMongoRepository();
    const messageRepository = new MessageMongoRepository();

    const sendMessageUseCase = new SendMessageUseCase(
        conversationRepository,
        messageRepository
    );

    const markMessagesAsReadUseCase = new MarkMessagesAsReadUseCase(
        messageRepository
    );

    io.on("connection", (socket: Socket) => {
        console.log("Cliente conectado:", socket.id);

        socket.on("user:register", (payload: RegisterUserPayload) => {
            onlineUsers.set(payload.userId, socket.id);

            io.emit("user:online", {
                userId: payload.userId,
            });
        });

        socket.on("chat:message", async (payload: SendMessagePayload) => {
            try {
                const result = await sendMessageUseCase.execute({
                    senderId: payload.senderId,
                    receiverId: payload.receiverId,
                    content: payload.content,
                });

                const receiverSocketId = onlineUsers.get(payload.receiverId);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("chat:message:received", result);
                }

                socket.emit("chat:message:sent", result);
            } catch (error) {
                socket.emit("chat:error", {
                    message:
                        error instanceof Error
                            ? error.message
                            : "Error enviando mensaje",
                });
            }
        });

        socket.on("chat:typing", (payload: TypingPayload) => {
            const receiverSocketId = onlineUsers.get(payload.receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("chat:typing", {
                    senderId: payload.senderId,
                });
            }
        });

        socket.on("chat:stop_typing", (payload: TypingPayload) => {
            const receiverSocketId = onlineUsers.get(payload.receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit("chat:stop_typing", {
                    senderId: payload.senderId,
                });
            }
        });

        socket.on("chat:read", async (payload: ReadMessagesPayload) => {
            try {
                await markMessagesAsReadUseCase.execute({
                    conversationId: payload.conversationId,
                    receiverId: payload.receiverId,
                });

                const senderSocketId = onlineUsers.get(payload.senderId);

                if (senderSocketId) {
                    io.to(senderSocketId).emit("chat:read", {
                        conversationId: payload.conversationId,
                        receiverId: payload.receiverId,
                    });
                }
            } catch (error) {
                socket.emit("chat:error", {
                    message:
                        error instanceof Error
                            ? error.message
                            : "Error marcando mensajes como leídos",
                });
            }
        });

        socket.on("disconnect", () => {
            let disconnectedUserId: string | null = null;

            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    onlineUsers.delete(userId);
                    break;
                }
            }

            if (disconnectedUserId) {
                io.emit("user:offline", {
                    userId: disconnectedUserId,
                });
            }

            console.log("Cliente desconectado:", socket.id);
        });
    });
};