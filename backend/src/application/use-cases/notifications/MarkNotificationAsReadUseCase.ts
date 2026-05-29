import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { AppError } from "../../../shared/errors/AppError";

export class MarkNotificationAsReadUseCase {
    async execute(notificationId: string, userId: string) {
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            throw new AppError("Notificación no encontrada", 404);
        }

        if (notification.userId !== userId) {
            throw new AppError("No tienes acceso a esta notificación", 403);
        }

        return prisma.notification.update({
            where: { id: notificationId },
            data: {
                read: true,
            },
        });
    }
}