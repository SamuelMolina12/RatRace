import { Request, Response, NextFunction } from "express";
import { ConversationMongoRepository } from "../../database/mongo/repositories/conversation.mongo.repository";
import { MessageMongoRepository } from "../../database/mongo/repositories/message.mongo.repository";
import { GetMessagesUseCase } from "../../../application/use-cases/chat/GetMessagesUseCase";
import { GetUserConversationsUseCase } from "../../../application/use-cases/chat/GetUserConversationsUseCase";

const conversationRepository = new ConversationMongoRepository();
const messageRepository = new MessageMongoRepository();

const getUserConversationsUseCase = new GetUserConversationsUseCase(
    conversationRepository
);

const getMessagesUseCase = new GetMessagesUseCase(messageRepository);

export class ChatController {
    async getUserConversations(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const userId = String(req.params.userId);

            const conversations = await getUserConversationsUseCase.execute({
                userId,
            });

            res.status(200).json({
                success: true,
                data: conversations,
                message: "Conversaciones consultadas correctamente",
            });
        } catch (error) {
            next(error);
        }
    }

    async getMessagesByConversation(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const conversationId = String(req.params.conversationId);

            const messages = await getMessagesUseCase.execute({
                conversationId,
            });

            res.status(200).json({
                success: true,
                data: messages,
                message: "Mensajes consultados correctamente",
            });
        } catch (error) {
            next(error);
        }
    }
}