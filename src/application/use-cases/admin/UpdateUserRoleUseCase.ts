import { UserRepository } from "../../../domain/repositories/UserRepository";
import { ROLES } from "../../../shared/constants/role.constants";
import { AppError } from "../../../shared/errors/AppError";

export class UpdateUserRoleUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, newRole: string) {

    const validRoles = Object.values(ROLES);
    if (!validRoles.includes(newRole as any)) {
      throw new AppError(
        `Rol inválido. Roles válidos: ${validRoles.join(", ")}`,
        400,
      );
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    if (user.role === newRole) {
      throw new AppError("El usuario ya tiene este rol", 400);
    }

    const updatedUser = await this.userRepository.updateRole(userId, newRole);

    return {
      id: updatedUser.id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    };
  }
}
