import { GetMyNotificationsUseCase } from "../../../application/use-cases/notifications/GetMyNotificationsUseCase";
import { prisma } from "../../../infrastructure/database/prisma/prisma.client";

jest.mock("../../../infrastructure/database/prisma/prisma.client", () => ({
    prisma: {
        notification: {
            findMany: jest.fn(),
        },
    },
}));

describe("GetMyNotificationsUseCase", () => {

    let getMyNotificationsUseCase: GetMyNotificationsUseCase;

    beforeEach(() => {

        getMyNotificationsUseCase =
            new GetMyNotificationsUseCase();

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should return all notifications successfully", async () => {

            (prisma.notification.findMany as jest.Mock)
                .mockResolvedValue([
                    {
                        id: "notification-1",
                        title: "Nuevo reto",
                    },
                    {
                        id: "notification-2",
                        title: "Mensaje recibido",
                    },
                ]);

            const result =
                await getMyNotificationsUseCase.execute(
                    "user-1"
                );

            expect(result).toEqual([
                {
                    id: "notification-1",
                    title: "Nuevo reto",
                },
                {
                    id: "notification-2",
                    title: "Mensaje recibido",
                },
            ]);

            expect(prisma.notification.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        userId: "user-1",
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });

        });

        test("should return only unread notifications", async () => {

            (prisma.notification.findMany as jest.Mock)
                .mockResolvedValue([
                    {
                        id: "notification-1",
                        read: false,
                    },
                ]);

            const result =
                await getMyNotificationsUseCase.execute(
                    "user-1",
                    true
                );

            expect(result).toEqual([
                {
                    id: "notification-1",
                    read: false,
                },
            ]);

            expect(prisma.notification.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        userId: "user-1",
                        read: false,
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });

        });

        test("should call prisma with correct userId", async () => {

            (prisma.notification.findMany as jest.Mock)
                .mockResolvedValue([]);

            await getMyNotificationsUseCase.execute(
                "user-99"
            );

            expect(prisma.notification.findMany)
                .toHaveBeenCalledTimes(1);

            expect(prisma.notification.findMany)
                .toHaveBeenCalledWith({
                    where: {
                        userId: "user-99",
                    },
                    orderBy: {
                        createdAt: "desc",
                    },
                });

        });

    });

});