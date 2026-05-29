import { Message } from "../../../../domain/entities/Message";
import { CreateMessageData, MessageRepository } from "../../../../domain/repositories/MessageRepository";
import { MessageModel } from "../models/message.model";

export class MessageMongoRepository implements MessageRepository {
    async createMessage(data: CreateMessageData): Promise<Message> {
        const message = await MessageModel.create({
            conversationId: data.conversationId,
            senderId: data.senderId,
            receiverId: data.receiverId,
            content: data.content,
            read: false,
        });

        return new Message(
            message.id,
            message.conversationId.toString(),
            message.senderId,
            message.receiverId,
            message.content,
            message.read,
            message.createdAt,
            message.updatedAt
        );
    }

    async findByConversationId(conversationId: string): Promise<Message[]> {
        const messages = await MessageModel.find({
            conversationId,
        }).sort({ createdAt: 1 });

        return messages.map(
            (message) =>
                new Message(
                    message.id,
                    message.conversationId.toString(),
                    message.senderId,
                    message.receiverId,
                    message.content,
                    message.read,
                    message.createdAt,
                    message.updatedAt
                )
        );
    }

    async markAsRead(
        conversationId: string,
        receiverId: string
    ): Promise<void> {
        await MessageModel.updateMany(
            {
                conversationId,
                receiverId,
                read: false,
            },
            {
                read: true,
            }
        );
    }
}