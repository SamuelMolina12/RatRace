import { AdminUserDto } from "../dtos/AdminUserDto";

export class AdminUserMapper {
  static toAdminUserDto(user: any): AdminUserDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      estado: user.estado,
      rank: user.rank,
      wins: user.wins,
      losses: user.losses,
      consecutiveWins: user.consecutiveWins,
      profilePhoto: user.profilePhoto,
      locality: user.locality,
      city: user.city,
      state: user.state,
      country: user.country,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
