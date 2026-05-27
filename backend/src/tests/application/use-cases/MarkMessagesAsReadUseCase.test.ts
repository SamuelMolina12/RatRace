import { MarkMessagesAsReadUseCase } from "../../../application/use-cases/chat/MarkMessagesAsReadUseCase";

describe("MarkMessagesAsReadUseCase", () => {

    let mockMessageRepository: any;

    let markMessagesAsReadUseCase: MarkMessagesAsReadUseCase;

    beforeEach(() => {

        mockMessageRepository = {
            markAsRead: jest.fn(),
        };

        markMessagesAsReadUseCase =
            new MarkMessagesAsReadUseCase(
                mockMessageRepository
            );

    });

    describe("execute", () => {

        test("should mark messages as read successfully", async () => {

            mockMessageRepository.markAsRead
                .mockResolvedValue(undefined);

            await markMessagesAsReadUseCase.execute({
                conversationId: "conversation-1",
                receiverId: "user-1",
            });

            expect(mockMessageRepository.markAsRead)
                .toHaveBeenCalledWith(
                    "conversation-1",
                    "user-1"
                );

            expect(mockMessageRepository.markAsRead)
                .toHaveBeenCalledTimes(1);

        });

        test("should throw error if conversationId is missing", async () => {

            await expect(
                markMessagesAsReadUseCase.execute({
                    conversationId: "",
                    receiverId: "user-1",
                })
            ).rejects.toThrow(
                new Error(
                    "conversationId y receiverId son obligatorios"
                )
            );

        });

        test("should throw error if receiverId is missing", async () => {

            await expect(
                markMessagesAsReadUseCase.execute({
                    conversationId: "conversation-1",
                    receiverId: "",
                })
            ).rejects.toThrow(
                new Error(
                    "conversationId y receiverId son obligatorios"
                )
            );

        });

        test("should call repository with correct parameters", async () => {

            mockMessageRepository.markAsRead
                .mockResolvedValue(undefined);

            await markMessagesAsReadUseCase.execute({
                conversationId: "conversation-99",
                receiverId: "user-99",
            });

            expect(mockMessageRepository.markAsRead)
                .toHaveBeenCalledWith(
                    "conversation-99",
                    "user-99"
                );

        });

    });

});