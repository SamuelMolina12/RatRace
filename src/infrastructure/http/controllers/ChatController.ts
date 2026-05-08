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
            const userId = (req as any).user?.sub;

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "Usuario no autenticado",
                    statusCode: 401,
                });
            }

            const conversations = await getUserConversationsUseCase.execute({
                userId,
            });

            return res.status(200).json({
                success: true,
                data: conversations,
                message: "Conversaciones obtenidas correctamente",
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
            const userId = (req as any).user?.sub;
            const conversationId = String(req.params.conversationId);

            if (!userId) {
                return res.status(401).json({
                    success: false,
                    error: "Usuario no autenticado",
                    statusCode: 401,
                });
            }

            const messages = await getMessagesUseCase.execute({
                conversationId,
                userId,
            });

            return res.status(200).json({
                success: true,
                data: messages,
                message: "Mensajes consultados correctamente",
            });
        } catch (error) {
            next(error);
        }
    }
}