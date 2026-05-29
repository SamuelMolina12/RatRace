import { GetUserProfileUseCase } from "../../../application/use-cases/users/GetUserProfileUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { UserMapper } from "../../../application/mappers/UserMapper";

jest.mock("../../../application/mappers/UserMapper", () => ({
    UserMapper: {
        toUserProfileDto: jest.fn(),
    },
}));

describe("GetUserProfileUseCase", () => {

    let mockUserRepository: any;

    let getUserProfileUseCase: GetUserProfileUseCase;

    beforeEach(() => {

        mockUserRepository = {
            findById: jest.fn(),
        };

        getUserProfileUseCase =
            new GetUserProfileUseCase(
                mockUserRepository
            );

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should return user profile successfully", async () => {

            const mockUser = {
                id: "user-1",
                username: "Samuel",
                email: "samuel@gmail.com",
            };

            const mappedUser = {
                id: "user-1",
                username: "Samuel",
            };

            mockUserRepository.findById
                .mockResolvedValue(mockUser);

            (UserMapper.toUserProfileDto as jest.Mock)
                .mockReturnValue(mappedUser);

            const result =
                await getUserProfileUseCase.execute(
                    "user-1"
                );

            expect(result).toEqual(mappedUser);

            expect(mockUserRepository.findById)
                .toHaveBeenCalledWith("user-1");

            expect(UserMapper.toUserProfileDto)
                .toHaveBeenCalledWith(mockUser);

        });

        test("should throw error if user does not exist", async () => {

            mockUserRepository.findById
                .mockResolvedValue(null);

            await expect(
                getUserProfileUseCase.execute(
                    "user-1"
                )
            ).rejects.toThrow(
                new AppError(
                    "Usuario no encontrado",
                    404
                )
            );

        });

        test("should call mapper correctly", async () => {

            const mockUser = {
                id: "user-99",
                username: "Carlos",
            };

            mockUserRepository.findById
                .mockResolvedValue(mockUser);

            (UserMapper.toUserProfileDto as jest.Mock)
                .mockReturnValue({
                    id: "user-99",
                });

            await getUserProfileUseCase.execute(
                "user-99"
            );

            expect(UserMapper.toUserProfileDto)
                .toHaveBeenCalledTimes(1);

            expect(UserMapper.toUserProfileDto)
                .toHaveBeenCalledWith(mockUser);

        });

    });

});