import { Conversation } from "../../../../domain/entities/Conversation";
import { ConversationRepository } from "../../../../domain/repositories/ConversationRepository";
import { ConversationModel } from "../models/conversation.model";

export class ConversationMongoRepository implements ConversationRepository {
    async findOrCreateConversation(
        userIdOne: string,
        userIdTwo: string
    ): Promise<Conversation> {
        const participants = [userIdOne, userIdTwo].sort();

        let conversation = await ConversationModel.findOne({
            participants: { $all: participants, $size: 2 },
        });

        if (!conversation) {
            conversation = await ConversationModel.create({
                participants,
            });
        }

        return new Conversation(
            conversation.id,
            conversation.participants,
            conversation.lastMessage,
            conversation.lastMessageAt,
            conversation.createdAt,
            conversation.updatedAt
        );
    }

    async findByUserId(userId: string): Promise<Conversation[]> {
        const conversations = await ConversationModel.find({
            participants: userId,
        }).sort({ updatedAt: -1 });

        return conversations.map(
            (conversation) =>
                new Conversation(
                    conversation.id,
                    conversation.participants,
                    conversation.lastMessage,
                    conversation.lastMessageAt,
                    conversation.createdAt,
                    conversation.updatedAt
                )
        );
    }

    async updateLastMessage(
        conversationId: string,
        lastMessage: string
    ): Promise<Conversation | null> {
        const conversation = await ConversationModel.findByIdAndUpdate(
            conversationId,
            {
                lastMessage,
                lastMessageAt: new Date(),
            },
            { new: true }
        );

        if (!conversation) {
            return null;
        }

        return new Conversation(
            conversation.id,
            conversation.participants,
            conversation.lastMessage,
            conversation.lastMessageAt,
            conversation.createdAt,
            conversation.updatedAt
        );
    }
}