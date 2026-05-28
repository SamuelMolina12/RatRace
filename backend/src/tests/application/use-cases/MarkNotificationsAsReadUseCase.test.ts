import { MarkNotificationAsReadUseCase } from "../../../application/use-cases/notifications/MarkNotificationAsReadUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { AppError } from "../../../shared/errors/AppError";

jest.mock("../../../infrastructure/database/prisma/prisma.client", () => ({
    prisma: {
        notification: {
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));

describe("MarkNotificationAsReadUseCase", () => {

    let markNotificationAsReadUseCase: MarkNotificationAsReadUseCase;

    beforeEach(() => {

        markNotificationAsReadUseCase =
            new MarkNotificationAsReadUseCase();

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should mark notification as read successfully", async () => {

            (prisma.notification.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "notification-1",
                    userId: "user-1",
                    read: false,
                });

            (prisma.notification.update as jest.Mock)
                .mockResolvedValue({
                    id: "notification-1",
                    read: true,
                });

            const result =
                await markNotificationAsReadUseCase.execute(
                    "notification-1",
                    "user-1"
                );

            expect(result).toEqual({
                id: "notification-1",
                read: true,
            });

            expect(prisma.notification.update)
                .toHaveBeenCalledWith({
                    where: {
                        id: "notification-1",
                    },
                    data: {
                        read: true,
                    },
                });

        });

        test("should throw error if notification does not exist", async () => {

            (prisma.notification.findUnique as jest.Mock)
                .mockResolvedValue(null);

            await expect(
                markNotificationAsReadUseCase.execute(
                    "notification-1",
                    "user-1"
                )
            ).rejects.toThrow(
                new AppError(
                    "Notificación no encontrada",
                    404
                )
            );

        });

        test("should throw error if user has no access to notification", async () => {

            (prisma.notification.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "notification-1",
                    userId: "another-user",
                });

            await expect(
                markNotificationAsReadUseCase.execute(
                    "notification-1",
                    "user-1"
                )
            ).rejects.toThrow(
                new AppError(
                    "No tienes acceso a esta notificación",
                    403
                )
            );

        });

        test("should update notification with read true", async () => {

            (prisma.notification.findUnique as jest.Mock)
                .mockResolvedValue({
                    id: "notification-1",
                    userId: "user-1",
                });

            (prisma.notification.update as jest.Mock)
                .mockResolvedValue({
                    id: "notification-1",
                    read: true,
                });

            await markNotificationAsReadUseCase.execute(
                "notification-1",
                "user-1"
            );

            expect(prisma.notification.update)
                .toHaveBeenCalledTimes(1);

            expect(prisma.notification.update)
                .toHaveBeenCalledWith({
                    where: {
                        id: "notification-1",
                    },
                    data: {
                        read: true,
                    },
                });

        });

    });

});