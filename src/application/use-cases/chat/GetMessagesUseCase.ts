import { MessageRepository } from "../../../domain/repositories/MessageRepository";
import { AppError } from "../../../shared/errors/AppError";

interface GetMessagesRequest {
    conversationId: string;
    userId: string;
}

export class GetMessagesUseCase {
    constructor(private readonly messageRepository: MessageRepository) { }

    async execute(request: GetMessagesRequest) {
        if (!request.conversationId) {
            throw new AppError("conversationId es obligatorio", 400);
        }

        if (!request.userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        return this.messageRepository.findByConversationId(request.conversationId);
    }
}