import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AdminUserMapper } from "../../mappers/AdminUserMapper";
import { AdminUserFilters } from "../../../domain/repositories/UserRepository";

export class GetAllAdminUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(
    page: number = 1,
    pageSize: number = 20,
    filters: AdminUserFilters = {},
  ) {
    const users = await this.userRepository.findAll(page, pageSize, filters);
    const total = await this.userRepository.countAll(filters);

    return {
      users: users.map((user) => AdminUserMapper.toAdminUserDto(user)),
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }
}
