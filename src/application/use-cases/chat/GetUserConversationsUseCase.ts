import { ConversationRepository } from "../../../domain/repositories/ConversationRepository";
import { AppError } from "../../../shared/errors/AppError";

interface GetUserConversationsRequest {
  userId: string;
}

export class GetUserConversationsUseCase {
  constructor(
    private readonly conversationRepository: ConversationRepository
  ) {}

  async execute(request: GetUserConversationsRequest) {
    if (!request.userId) {
      throw new AppError("userId es obligatorio", 400);
    }

    return this.conversationRepository.findByUserId(request.userId);
  }
}