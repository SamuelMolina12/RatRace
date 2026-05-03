export class Conversation {
    constructor(
        public readonly id: string,
        public readonly participants: string[],
        public readonly lastMessage?: string,
        public readonly lastMessageAt?: Date,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}