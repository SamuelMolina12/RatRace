import { MessageRepository } from "../../../domain/repositories/MessageRepository";
import { AppError } from "../../../shared/errors/AppError";

interface MarkMessagesAsReadRequest {
    conversationId: string;
    receiverId: string;
}

export class MarkMessagesAsReadUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(request: MarkMessagesAsReadRequest) {
        if (!request.conversationId || !request.receiverId) {
            throw new AppError("conversationId y receiverId son obligatorios", 400);
        }

        await this.messageRepository.markAsRead(
            request.conversationId,
            request.receiverId
        );
    }
}