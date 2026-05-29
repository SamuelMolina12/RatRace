import { GetMessagesUseCase } from "../../../application/use-cases/chat/GetMessagesUseCase";
import { AppError } from "../../../shared/errors/AppError";

describe("GetMessagesUseCase", () => {

    let mockMessageRepository: any;

    let getMessagesUseCase: GetMessagesUseCase;

    beforeEach(() => {

        mockMessageRepository = {
            findByConversationId: jest.fn(),
        };

        getMessagesUseCase = new GetMessagesUseCase(
            mockMessageRepository
        );

    });

    describe("execute", () => {

        test("should return messages successfully", async () => {

            mockMessageRepository.findByConversationId
                .mockResolvedValue([
                    {
                        id: "message-1",
                        content: "Hola",
                    },
                    {
                        id: "message-2",
                        content: "¿Cómo estás?",
                    },
                ]);

            const result = await getMessagesUseCase.execute({
                conversationId: "conversation-1",
                userId: "user-1",
            });

            expect(result).toEqual([
                {
                    id: "message-1",
                    content: "Hola",
                },
                {
                    id: "message-2",
                    content: "¿Cómo estás?",
                },
            ]);

            expect(mockMessageRepository.findByConversationId)
                .toHaveBeenCalledWith("conversation-1");

        });

        test("should throw error if conversationId is missing", async () => {

            await expect(
                getMessagesUseCase.execute({
                    conversationId: "",
                    userId: "user-1",
                })
            ).rejects.toThrow(
                new AppError(
                    "conversationId es obligatorio",
                    400
                )
            );

        });

        test("should throw error if user is not authenticated", async () => {

            await expect(
                getMessagesUseCase.execute({
                    conversationId: "conversation-1",
                    userId: "",
                })
            ).rejects.toThrow(
                new AppError(
                    "Usuario no autenticado",
                    401
                )
            );

        });

        test("should call repository with correct conversationId", async () => {

            mockMessageRepository.findByConversationId
                .mockResolvedValue([]);

            await getMessagesUseCase.execute({
                conversationId: "conversation-99",
                userId: "user-1",
            });

            expect(mockMessageRepository.findByConversationId)
                .toHaveBeenCalledTimes(1);

            expect(mockMessageRepository.findByConversationId)
                .toHaveBeenCalledWith("conversation-99");

        });

    });

});