import { SendMessageUseCase } from "../../../application/use-cases/chat/SendMessageUseCase";

describe("SendMessageUseCase", () => {

    let mockConversationRepository: any;
    let mockMessageRepository: any;

    let sendMessageUseCase: SendMessageUseCase;

    beforeEach(() => {

        mockConversationRepository = {
            findOrCreateConversation: jest.fn(),
            updateLastMessage: jest.fn(),
        };

        mockMessageRepository = {
            createMessage: jest.fn(),
        };

        sendMessageUseCase = new SendMessageUseCase(
            mockConversationRepository,
            mockMessageRepository
        );

    });

    describe("execute", () => {

        test("should send message successfully", async () => {

            mockConversationRepository.findOrCreateConversation
                .mockResolvedValue({
                    id: "conversation-1",
                });

            mockMessageRepository.createMessage
                .mockResolvedValue({
                    id: "message-1",
                    content: "Hola",
                });

            mockConversationRepository.updateLastMessage
                .mockResolvedValue(undefined);

            const result = await sendMessageUseCase.execute({
                senderId: "user-1",
                receiverId: "user-2",
                content: "Hola",
            });

            expect(result).toEqual({
                conversation: {
                    id: "conversation-1",
                },
                message: {
                    id: "message-1",
                    content: "Hola",
                },
            });

            expect(
                mockConversationRepository.findOrCreateConversation
            ).toHaveBeenCalledWith(
                "user-1",
                "user-2"
            );

            expect(
                mockMessageRepository.createMessage
            ).toHaveBeenCalledWith({
                conversationId: "conversation-1",
                senderId: "user-1",
                receiverId: "user-2",
                content: "Hola",
            });

            expect(
                mockConversationRepository.updateLastMessage
            ).toHaveBeenCalledWith(
                "conversation-1",
                "Hola"
            );

        });

        test("should throw error if required fields are missing", async () => {

            await expect(
                sendMessageUseCase.execute({
                    senderId: "",
                    receiverId: "user-2",
                    content: "",
                })
            ).rejects.toThrow(
                new Error(
                    "senderId, receiverId y content son obligatorios"
                )
            );

        });

        test("should throw error if sender and receiver are the same", async () => {

            await expect(
                sendMessageUseCase.execute({
                    senderId: "user-1",
                    receiverId: "user-1",
                    content: "Hola",
                })
            ).rejects.toThrow(
                new Error(
                    "No puedes enviarte mensajes a ti mismo"
                )
            );

        });

        test("should trim content before saving message", async () => {

            mockConversationRepository.findOrCreateConversation
                .mockResolvedValue({
                    id: "conversation-1",
                });

            mockMessageRepository.createMessage
                .mockResolvedValue({
                    id: "message-1",
                    content: "Hola",
                });

            mockConversationRepository.updateLastMessage
                .mockResolvedValue(undefined);

            await sendMessageUseCase.execute({
                senderId: "user-1",
                receiverId: "user-2",
                content: "   Hola   ",
            });

            expect(
                mockMessageRepository.createMessage
            ).toHaveBeenCalledWith({
                conversationId: "conversation-1",
                senderId: "user-1",
                receiverId: "user-2",
                content: "Hola",
            });

            expect(
                mockConversationRepository.updateLastMessage
            ).toHaveBeenCalledWith(
                "conversation-1",
                "Hola"
            );

        });

    });

});