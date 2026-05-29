import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";

describe("LoginUseCase", () => {

    let mockUserRepository: any;
    let mockPasswordService: any;
    let mockJwtService: any;

    let loginUseCase: LoginUseCase;

    beforeEach(() => {

        mockUserRepository = {
            findByEmail: jest.fn(),
        };

        mockPasswordService = {
            compare: jest.fn(),
        };

        mockJwtService = {
            generateToken: jest.fn(),
        };

        loginUseCase = new LoginUseCase(
            mockUserRepository,
            mockPasswordService,
            mockJwtService
        );

    });

    describe("execute", () => {

        test("should login successfully", async () => {

            mockUserRepository.findByEmail.mockResolvedValue({
                id: "123",
                username: "Samuel",
                email: "samuel@gmail.com",
                passwordHash: "hashed-password",
                role: "PILOT",
            });

            mockPasswordService.compare.mockResolvedValue(true);

            mockJwtService.generateToken.mockReturnValue("jwt-token");

            const result = await loginUseCase.execute({
                email: "samuel@gmail.com",
                password: "123456",
            });

            expect(result).toEqual({
                token: "jwt-token",
                user: {
                    id: "123",
                    username: "Samuel",
                    email: "samuel@gmail.com",
                    role: "PILOT",
                },
            });

            expect(mockUserRepository.findByEmail)
                .toHaveBeenCalledWith("samuel@gmail.com");

            expect(mockPasswordService.compare)
                .toHaveBeenCalledWith(
                    "123456",
                    "hashed-password"
                );

            expect(mockJwtService.generateToken)
                .toHaveBeenCalledWith({
                    sub: "123",
                    email: "samuel@gmail.com",
                    role: "PILOT",
                });

        });

        test("should throw error if user does not exist", async () => {

            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(
                loginUseCase.execute({
                    email: "samuel@gmail.com",
                    password: "123456",
                })
            ).rejects.toThrow(
                new Error("Credenciales invalidas")
            );

        });

        test("should throw error if password is invalid", async () => {

            mockUserRepository.findByEmail.mockResolvedValue({
                id: "123",
                username: "Samuel",
                email: "samuel@gmail.com",
                passwordHash: "hashed-password",
                role: "PILOT",
            });

            mockPasswordService.compare.mockResolvedValue(false);

            await expect(
                loginUseCase.execute({
                    email: "samuel@gmail.com",
                    password: "123456",
                })
            ).rejects.toThrow(
                new Error("Credenciales invalidas")
            );

            expect(mockPasswordService.compare)
                .toHaveBeenCalledWith(
                    "123456",
                    "hashed-password"
                );

        });

    });

});