import { MessageRepository } from "../../../domain/repositories/MessageRepository";

interface MarkMessagesAsReadRequest {
    conversationId: string;
    receiverId: string;
}

export class MarkMessagesAsReadUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(request: MarkMessagesAsReadRequest) {
        if (!request.conversationId || !request.receiverId) {
            throw new Error("conversationId y receiverId son obligatorios");
        }

        await this.messageRepository.markAsRead(
            request.conversationId,
            request.receiverId
        );
    }
}