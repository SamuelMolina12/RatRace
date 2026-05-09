import { Schema, model, Document, Types } from "mongoose";

export interface MessageDocument extends Document {
    conversationId: Types.ObjectId;
    senderId: string;
    receiverId: string;
    content: string;
    read: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const messageSchema = new Schema<MessageDocument>(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: "Conversation",
            required: true,
            index: true,
        },
        senderId: {
            type: String,
            required: true,
            index: true,
        },
        receiverId: {
            type: String,
            required: true,
            index: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export const MessageModel = model<MessageDocument>("Message", messageSchema);