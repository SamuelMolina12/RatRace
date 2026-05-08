import { UserRepository } from "../../../domain/repositories/UserRepository";

export class GetAllUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(page: number = 1, pageSize: number = 20) {
    const users = await this.userRepository.findAll(page, pageSize);
    const total = await this.userRepository.countAll();

    return {
      users,
      pagination: {
        page,
        pageSize,
        total,
        pages: Math.ceil(total / pageSize),
      },
    };
  }
}
