import { RegisterUseCase } from "../../../application/use-cases/auth/RegisterUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { ROLES } from "../../../shared/constants/role.constants";

describe("RegisterUseCase", () => {

    let mockUserRepository: any;
    let mockPasswordService: any;

    let registerUseCase: RegisterUseCase;

    beforeEach(() => {

        mockUserRepository = {
            findByEmail: jest.fn(),
            findByUsername: jest.fn(),
            create: jest.fn(),
        };

        mockPasswordService = {
            hash: jest.fn(),
        };

        registerUseCase = new RegisterUseCase(
            mockUserRepository,
            mockPasswordService
        );
    });

    describe("execute", () => {

        test("should register user successfully", async () => {

            mockUserRepository.findByEmail.mockResolvedValue(null);

            mockUserRepository.findByUsername.mockResolvedValue(null);

            mockPasswordService.hash.mockResolvedValue("hashed-password");

            mockUserRepository.create.mockResolvedValue({
                id: "123",
                username: "Samuel",
                email: "samuel@gmail.com",
            });

            const result = await registerUseCase.execute({
                username: "Samuel",
                email: "samuel@gmail.com",
                password: "123456",
            });

            expect(result).toEqual({
                id: "123",
                username: "Samuel",
                email: "samuel@gmail.com",
            });

            expect(mockPasswordService.hash).toHaveBeenCalledWith("123456");

            expect(mockUserRepository.create).toHaveBeenCalledWith({
                username: "Samuel",
                email: "samuel@gmail.com",
                passwordHash: "hashed-password",
                role: ROLES.PILOT,
                rank: "D",
                wins: 0,
                losses: 0,
                profilePhoto: undefined,
                locality: undefined,
                city: undefined,
                state: undefined,
                country: undefined,
            });

        });

        test("should throw error if email already exists", async () => {

            mockUserRepository.findByEmail.mockResolvedValue({
                id: "1",
            });

            await expect(
                registerUseCase.execute({
                    username: "Samuel",
                    email: "samuel@gmail.com",
                    password: "123456",
                })
            ).rejects.toThrow(
                new AppError("El email ya está registrado", 400)
            );

        });

        test("should throw error if username already exists", async () => {

            mockUserRepository.findByEmail.mockResolvedValue(null);

            mockUserRepository.findByUsername.mockResolvedValue({
                id: "1",
            });

            await expect(
                registerUseCase.execute({
                    username: "Samuel",
                    email: "samuel@gmail.com",
                    password: "123456",
                })
            ).rejects.toThrow(
                new AppError("El username ya está registrado", 400)
            );

        });

    });

});