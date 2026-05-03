import { Conversation } from "../entities/Conversation";

export interface ConversationRepository {
    findOrCreateConversation(
        userIdOne: string,
        userIdTwo: string
    ): Promise<Conversation>;

    findByUserId(userId: string): Promise<Conversation[]>;

    updateLastMessage(
        conversationId: string,
        lastMessage: string
    ): Promise<Conversation | null>;
}