import { UpdateMyProfileUseCase } from "../../../application/use-cases/users/UpdateMyProfileUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { UserMapper } from "../../../application/mappers/UserMapper";

jest.mock("../../../application/mappers/UserMapper", () => ({
    UserMapper: {
        toUserProfileDto: jest.fn(),
    },
}));

describe("UpdateMyProfileUseCase", () => {

    let mockUserRepository: any;

    let updateMyProfileUseCase: UpdateMyProfileUseCase;

    beforeEach(() => {

        mockUserRepository = {
            findById: jest.fn(),
            updateProfile: jest.fn(),
        };

        updateMyProfileUseCase =
            new UpdateMyProfileUseCase(
                mockUserRepository
            );

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should update profile successfully", async () => {

            const mockUser = {
                id: "user-1",
                username: "Samuel",
            };

            const updatedUser = {
                id: "user-1",
                username: "Samuel Updated",
            };

            const mappedUser = {
                id: "user-1",
                username: "Samuel Updated",
            };

            mockUserRepository.findById
                .mockResolvedValue(mockUser);

            mockUserRepository.updateProfile
                .mockResolvedValue(updatedUser);

            (UserMapper.toUserProfileDto as jest.Mock)
                .mockReturnValue(mappedUser);

            const result =
                await updateMyProfileUseCase.execute(
                    "user-1",
                    {
                        username: "Samuel Updated",
                    }
                );

            expect(result).toEqual(mappedUser);

            expect(mockUserRepository.findById)
                .toHaveBeenCalledWith("user-1");

            expect(mockUserRepository.updateProfile)
                .toHaveBeenCalledWith(
                    "user-1",
                    {
                        username: "Samuel Updated",
                    }
                );

            expect(UserMapper.toUserProfileDto)
                .toHaveBeenCalledWith(updatedUser);

        });

        test("should throw error if user does not exist", async () => {

            mockUserRepository.findById
                .mockResolvedValue(null);

            await expect(
                updateMyProfileUseCase.execute(
                    "user-1",
                    {
                        username: "Samuel",
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Usuario no encontrado",
                    404
                )
            );

        });

        test("should call mapper with updated user", async () => {

            const updatedUser = {
                id: "user-99",
                username: "Carlos",
            };

            mockUserRepository.findById
                .mockResolvedValue({
                    id: "user-99",
                });

            mockUserRepository.updateProfile
                .mockResolvedValue(updatedUser);

            (UserMapper.toUserProfileDto as jest.Mock)
                .mockReturnValue({
                    id: "user-99",
                });

            await updateMyProfileUseCase.execute(
                "user-99",
                {
                    username: "Carlos",
                }
            );

            expect(UserMapper.toUserProfileDto)
                .toHaveBeenCalledTimes(1);

            expect(UserMapper.toUserProfileDto)
                .toHaveBeenCalledWith(updatedUser);

        });

    });

});