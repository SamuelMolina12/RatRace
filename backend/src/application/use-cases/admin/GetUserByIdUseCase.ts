import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { AdminUserMapper } from "../../mappers/AdminUserMapper";

export class GetUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    return AdminUserMapper.toAdminUserDto(user);
  }
}
