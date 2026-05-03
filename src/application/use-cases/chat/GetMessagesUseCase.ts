import { MessageRepository } from "../../../domain/repositories/MessageRepository";

interface GetMessagesRequest {
    conversationId: string;
}

export class GetMessagesUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(request: GetMessagesRequest) {
        if (!request.conversationId) {
            throw new Error("conversationId es obligatorio");
        }

        return this.messageRepository.findByConversationId(request.conversationId);
    }
}