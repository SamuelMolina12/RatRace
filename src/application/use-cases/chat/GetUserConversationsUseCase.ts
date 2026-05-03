import { ConversationRepository } from "../../../domain/repositories/ConversationRepository";

interface GetUserConversationsRequest {
    userId: string;
}

export class GetUserConversationsUseCase {
    constructor(
        private readonly conversationRepository: ConversationRepository
    ) { }

    async execute(request: GetUserConversationsRequest) {
        if (!request.userId) {
            throw new Error("userId es obligatorio");
        }

        return this.conversationRepository.findByUserId(request.userId);
    }
}