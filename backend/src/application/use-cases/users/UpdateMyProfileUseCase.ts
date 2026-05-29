import {
  UpdateUserProfileData,
  UserRepository
} from "../../../domain/repositories/UserRepository";
import { UserMapper } from "../../mappers/UserMapper";
import { AppError } from "../../../shared/errors/AppError";

export class UpdateMyProfileUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(userId: string, data: UpdateUserProfileData) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError("Usuario no encontrado", 404);
    }

    const updatedUser = await this.userRepository.updateProfile(userId, data);

    return UserMapper.toUserProfileDto(updatedUser);
  }
}