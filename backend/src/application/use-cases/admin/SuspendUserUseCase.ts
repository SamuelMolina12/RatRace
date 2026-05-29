import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";
import { AdminUserMapper } from "../../mappers/AdminUserMapper";

export class SuspendUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    if (user.estado === "SUSPENDIDO") {
      throw new AppError("El usuario ya se encuentra suspendido", 400);
    }

    const updatedUser = await this.userRepository.updateEstado(
      userId,
      "SUSPENDIDO",
    );

    return AdminUserMapper.toAdminUserDto(updatedUser);
  }
}
