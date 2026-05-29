import { ConversationRepository } from "../../../domain/repositories/ConversationRepository";
import { MessageRepository } from "../../../domain/repositories/MessageRepository";
import { AppError } from "../../../shared/errors/AppError";

interface SendMessageRequest {
    senderId: string;
    receiverId: string;
    content: string;
}

export class SendMessageUseCase {
    constructor(
        private readonly conversationRepository: ConversationRepository,
        private readonly messageRepository: MessageRepository
    ) { }

    async execute(request: SendMessageRequest) {
        const { senderId, receiverId, content } = request;

        if (!senderId || !receiverId || !content?.trim()) {
            throw new AppError("senderId, receiverId y content son obligatorios", 400);
        }

        if (senderId === receiverId) {
            throw new AppError("No puedes enviarte mensajes a ti mismo", 400);
        }

        const conversation =
            await this.conversationRepository.findOrCreateConversation(
                senderId,
                receiverId
            );

        const message = await this.messageRepository.createMessage({
            conversationId: conversation.id,
            senderId,
            receiverId,
            content: content.trim(),
        });

        await this.conversationRepository.updateLastMessage(
            conversation.id,
            content.trim()
        );

        return {
            conversation,
            message,
        };
    }
}