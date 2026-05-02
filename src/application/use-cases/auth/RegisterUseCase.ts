import { UserRepository } from "../../../domain/repositories/UserRepository";
import { PasswordService } from "../../../infrastructure/security/PasswordService";
import { AppError } from "../../../shared/errors/AppError";

interface RegisterInput {
  username: string;
  email: string;
  password: string;
  profile_photo?: string;
  zone?: {
    locality: string;
    city: string;
    state: string;
    country: string;
  }[];
}

export class RegisterUseCase {
  constructor(
    private userRepository: UserRepository,
    private passwordService: PasswordService
  ) {}

  async execute(input: RegisterInput) {
    const { username, email, password } = input;

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUsername = username.trim();

    const existingUser = await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new AppError("El email ya está registrado", 400);
    }

    const existingUsername = await this.userRepository.findByUsername(normalizedUsername);

if (existingUsername) {
  throw new AppError("El username ya está registrado", 400);
}

    const passwordHash = await this.passwordService.hash(password);

const user = await this.userRepository.create({
  username: normalizedUsername,
  email: normalizedEmail,
  passwordHash,
  rango: "D",
  victorias: 0,
  derrotas: 0,
  fotoPerfil: input.profile_photo,
  zonaLocalidad: input.zone?.[0]?.locality,
  zonaCiudad: input.zone?.[0]?.city,
  zonaEstado: input.zone?.[0]?.state,
  zonaPais: input.zone?.[0]?.country
});

    return {
      id: user.id,
      username: user.username,
      email: user.email
    };
  }
}