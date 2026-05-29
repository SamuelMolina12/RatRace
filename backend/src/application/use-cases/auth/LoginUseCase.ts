import { UserRepository } from "../../../domain/repositories/UserRepository";
import { JwtService } from "../../../infrastructure/security/JwtService";
import { PasswordService } from "../../../infrastructure/security/PasswordService";
import { AppError } from "../../../shared/errors/AppError";

interface LoginInput {
  email: string;
  password: string;
}

export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService,
    private jwtService: JwtService
  ) {}

  async execute(input: LoginInput) {
    const { email, password } = input;

    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError("Credenciales invalidas", 401);
    }

    const isPasswordValid = await this.passwordService.compare(
      password,
      user.passwordHash
    );

    if (!isPasswordValid) {
      throw new AppError("Credenciales invalidas", 401);
    }

const token = this.jwtService.generateToken({
  sub: user.id,
  email: user.email,
  role: user.role
});

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    };
  }
}