import { GetMeUseCase } from "../../../application/use-cases/auth/GetMeUseCase";
import { AppError } from "../../../shared/errors/AppError";

describe("GetMeUseCase", () => {

    let mockUserRepository: any;

    let getMeUseCase: GetMeUseCase;

    beforeEach(() => {

        mockUserRepository = {
            findById: jest.fn(),
        };

        getMeUseCase = new GetMeUseCase(
            mockUserRepository
        );

    });

    describe("execute", () => {

        test("should return authenticated user data successfully", async () => {

            mockUserRepository.findById.mockResolvedValue({
                id: "123",
                username: "Samuel",
                email: "samuel@gmail.com",
                role: "PILOT",
                rango: "A",
                victorias: 10,
                derrotas: 2,
            });

            const result = await getMeUseCase.execute("123");

            expect(result).toEqual({
                id: "123",
                username: "Samuel",
                email: "samuel@gmail.com",
                role: "PILOT",
                rango: "A",
                victorias: 10,
                derrotas: 2,
            });

            expect(mockUserRepository.findById)
                .toHaveBeenCalledWith("123");

        });

        test("should throw error if user does not exist", async () => {

            mockUserRepository.findById.mockResolvedValue(null);

            await expect(
                getMeUseCase.execute("123")
            ).rejects.toThrow(
                new AppError("Usuario no encontrado", 404)
            );

            expect(mockUserRepository.findById)
                .toHaveBeenCalledWith("123");

        });

        test("should return only required user fields", async () => {

            mockUserRepository.findById.mockResolvedValue({
                id: "123",
                username: "Samuel",
                email: "samuel@gmail.com",
                role: "PILOT",
                rango: "A",
                victorias: 10,
                derrotas: 2,
                passwordHash: "secret-password",
                createdAt: new Date(),
            });

            const result = await getMeUseCase.execute("123");

            expect(result).not.toHaveProperty("passwordHash");

            expect(result).not.toHaveProperty("createdAt");

        });

    });

});