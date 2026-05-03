import { Message } from "../entities/Message";

export interface CreateMessageData {
    conversationId: string;
    senderId: string;
    receiverId: string;
    content: string;
}

export interface MessageRepository {
    createMessage(data: CreateMessageData): Promise<Message>;

    findByConversationId(conversationId: string): Promise<Message[]>;

    markAsRead(conversationId: string, receiverId: string): Promise<void>;
}