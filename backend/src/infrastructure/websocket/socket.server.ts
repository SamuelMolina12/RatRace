import { Server, Socket } from "socket.io";
import { ConversationMongoRepository } from "../database/mongo/repositories/conversation.mongo.repository";
import { MessageMongoRepository } from "../database/mongo/repositories/message.mongo.repository";
import { SendMessageUseCase } from "../../application/use-cases/chat/SendMessageUseCase";
import { MarkMessagesAsReadUseCase } from "../../application/use-cases/chat/MarkMessagesAsReadUseCase";
import { onlineUsers } from "./socket.emitter";
import { SOCKET_EVENT } from "../../shared/constants/socket-event.constants";
import { NotificationService } from "../../application/services/NotificationService";
import { NOTIFICATION_TYPE } from "../../shared/constants/notification.constants";

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

        socket.on(SOCKET_EVENT.USER_REGISTER, (payload: RegisterUserPayload) => {
            onlineUsers.set(payload.userId, socket.id);

            io.emit(SOCKET_EVENT.USER_ONLINE, {
                userId: payload.userId,
            });

            // Send the list of all currently online user IDs to the newly connected user
            socket.emit(SOCKET_EVENT.USERS_ONLINE_LIST, {
                userIds: Array.from(onlineUsers.keys()),
            });
        });

        socket.on(SOCKET_EVENT.CHAT_MESSAGE, async (payload: SendMessagePayload) => {
            try {
                const result = await sendMessageUseCase.execute({
                    senderId: payload.senderId,
                    receiverId: payload.receiverId,
                    content: payload.content,
                });

                const receiverSocketId = onlineUsers.get(payload.receiverId);

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit(
                        SOCKET_EVENT.CHAT_MESSAGE_RECEIVED,
                        result
                    );
                }

                await NotificationService.createAndEmit(io, {
                    userId: payload.receiverId,
                    type: NOTIFICATION_TYPE.CHAT_MESSAGE,
                    message: "Has recibido un nuevo mensaje",
                    referenceId: result.conversation.id,
                    data: {
                        conversationId: result.conversation.id,
                        message: result.message,
                        senderId: payload.senderId,
                    },
                });

                socket.emit(SOCKET_EVENT.CHAT_MESSAGE_SENT, result);
            } catch (error) {
                socket.emit(SOCKET_EVENT.CHAT_ERROR, {
                    message:
                        error instanceof Error ? error.message : "Error enviando mensaje",
                });
            }
        });

        socket.on(SOCKET_EVENT.CHAT_TYPING, (payload: TypingPayload) => {
            const receiverSocketId = onlineUsers.get(payload.receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit(SOCKET_EVENT.CHAT_TYPING, {
                    senderId: payload.senderId,
                });
            }
        });

        socket.on(SOCKET_EVENT.CHAT_STOP_TYPING, (payload: TypingPayload) => {
            const receiverSocketId = onlineUsers.get(payload.receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit(SOCKET_EVENT.CHAT_STOP_TYPING, {
                    senderId: payload.senderId,
                });
            }
        });

        socket.on(SOCKET_EVENT.CHAT_READ, async (payload: ReadMessagesPayload) => {
            try {
                await markMessagesAsReadUseCase.execute({
                    conversationId: payload.conversationId,
                    receiverId: payload.receiverId,
                });

                const senderSocketId = onlineUsers.get(payload.senderId);

                if (senderSocketId) {
                    io.to(senderSocketId).emit(SOCKET_EVENT.CHAT_READ, {
                        conversationId: payload.conversationId,
                        receiverId: payload.receiverId,
                    });
                }
            } catch (error) {
                socket.emit(SOCKET_EVENT.CHAT_ERROR, {
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
                io.emit(SOCKET_EVENT.USER_OFFLINE, {
                    userId: disconnectedUserId,
                });
            }

            console.log("Cliente desconectado:", socket.id);
        });
    });
};