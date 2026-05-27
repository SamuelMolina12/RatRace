import { GetUserConversationsUseCase } from "../../../application/use-cases/chat/GetUserConversationsUseCase";
import { AppError } from "../../../shared/errors/AppError";

describe("GetUserConversationsUseCase", () => {

    let mockConversationRepository: any;

    let getUserConversationsUseCase: GetUserConversationsUseCase;

    beforeEach(() => {

        mockConversationRepository = {
            findByUserId: jest.fn(),
        };

        getUserConversationsUseCase =
            new GetUserConversationsUseCase(
                mockConversationRepository
            );

    });

    describe("execute", () => {

        test("should return user conversations successfully", async () => {

            mockConversationRepository.findByUserId
                .mockResolvedValue([
                    {
                        id: "conversation-1",
                        participants: ["user-1", "user-2"],
                    },
                    {
                        id: "conversation-2",
                        participants: ["user-1", "user-3"],
                    },
                ]);

            const result =
                await getUserConversationsUseCase.execute({
                    userId: "user-1",
                });

            expect(result).toEqual([
                {
                    id: "conversation-1",
                    participants: ["user-1", "user-2"],
                },
                {
                    id: "conversation-2",
                    participants: ["user-1", "user-3"],
                },
            ]);

            expect(mockConversationRepository.findByUserId)
                .toHaveBeenCalledWith("user-1");

        });

        test("should throw error if userId is missing", async () => {

            await expect(
                getUserConversationsUseCase.execute({
                    userId: "",
                })
            ).rejects.toThrow(
                new AppError(
                    "userId es obligatorio",
                    400
                )
            );

        });

        test("should call repository with correct userId", async () => {

            mockConversationRepository.findByUserId
                .mockResolvedValue([]);

            await getUserConversationsUseCase.execute({
                userId: "user-99",
            });

            expect(mockConversationRepository.findByUserId)
                .toHaveBeenCalledTimes(1);

            expect(mockConversationRepository.findByUserId)
                .toHaveBeenCalledWith("user-99");

        });

    });

});