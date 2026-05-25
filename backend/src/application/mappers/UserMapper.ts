import { UserProfileDto } from "../dtos/UserProfileDto";

export class UserMapper {
  static toUserProfileDto(user: any): UserProfileDto {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      rank: user.rank,
      wins: user.wins,
      losses: user.losses,
      profilePhoto: user.profilePhoto,
      locality: user.locality,
      city: user.city,
      state: user.state,
      country: user.country
    };
  }
}