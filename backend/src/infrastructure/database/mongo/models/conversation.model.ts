import { Schema, model, Document } from "mongoose";

export interface ConversationDocument extends Document {
    participants: string[];
    lastMessage?: string;
    lastMessageAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const conversationSchema = new Schema<ConversationDocument>(
    {
        participants: {
            type: [String],
            required: true,
        },
        lastMessage: {
            type: String,
            trim: true,
        },
        lastMessageAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

conversationSchema.index({ participants: 1 }, { unique: true });

export const ConversationModel = model<ConversationDocument>(
    "Conversation",
    conversationSchema
);