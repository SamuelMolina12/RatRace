import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";


export class GetMeUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      rango: user.rango,
      victorias: user.victorias,
      derrotas: user.derrotas
    };
  }
}