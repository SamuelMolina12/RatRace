import { prisma } from "../../../infrastructure/database/prisma/prisma.client";

export class GetMyNotificationsUseCase {
    async execute(userId: string, unreadOnly?: boolean) {
        return prisma.notification.findMany({
            where: {
                userId,
                ...(unreadOnly ? { read: false } : {}),
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
}