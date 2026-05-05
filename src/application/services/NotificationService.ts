import { Server } from "socket.io";
import { prisma } from "../../infrastructure/database/prisma/prisma.client";
import { emitToUser } from "../../infrastructure/websocket/socket.emitter";
import { SOCKET_EVENT } from "../../shared/constants/socket-event.constants";
import { NotificationType } from "../../shared/constants/notification.constants";

interface CreateNotificationData {
    userId: string;
    type: NotificationType;
    message: string;
    referenceId?: string;
    data?: unknown;
}

export class NotificationService {
    static async create(data: CreateNotificationData) {
        return prisma.notification.create({
            data: {
                userId: data.userId,
                type: data.type,
                message: data.message,
                referenceId: data.referenceId,
            },
        });
    }

    static async createAndEmit(io: Server, data: CreateNotificationData) {
        const notification = await this.create(data);

        emitToUser(io, data.userId, SOCKET_EVENT.NOTIFICATION_NEW, {
            ...notification,
            data: data.data,
        });

        return notification;
    }
}