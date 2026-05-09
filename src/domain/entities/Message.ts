export class Message {
    constructor(
        public readonly id: string,
        public readonly conversationId: string,
        public readonly senderId: string,
        public readonly receiverId: string,
        public readonly content: string,
        public readonly read: boolean,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}