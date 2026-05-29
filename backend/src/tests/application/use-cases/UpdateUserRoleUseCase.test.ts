import { UpdateUserRoleUseCase } from "../../../application/use-cases/admin/UpdateUserRoleUseCase";
import { ROLES } from "../../../shared/constants/role.constants";
import { AppError } from "../../../shared/errors/AppError";

describe("UpdateUserRoleUseCase", () => {

    let mockUserRepository: any;

    let updateUserRoleUseCase: UpdateUserRoleUseCase;

    beforeEach(() => {

        mockUserRepository = {
            findById: jest.fn(),
            updateRole: jest.fn(),
        };

        updateUserRoleUseCase = new UpdateUserRoleUseCase(
            mockUserRepository
        );

    });

    describe("execute", () => {

        test("should update user role successfully", async () => {

            mockUserRepository.findById.mockResolvedValue({
                id: "1",
                username: "Samuel",
                email: "samuel@gmail.com",
                role: ROLES.PILOT,
            });

            mockUserRepository.updateRole.mockResolvedValue({
                id: "1",
                username: "Samuel",
                email: "samuel@gmail.com",
                role: ROLES.ADMIN,
            });

            const result = await updateUserRoleUseCase.execute(
                "1",
                ROLES.ADMIN
            );

            expect(result).toEqual({
                id: "1",
                username: "Samuel",
                email: "samuel@gmail.com",
                role: ROLES.ADMIN,
            });

            expect(mockUserRepository.findById)
                .toHaveBeenCalledWith("1");

            expect(mockUserRepository.updateRole)
                .toHaveBeenCalledWith(
                    "1",
                    ROLES.ADMIN
                );

        });

        test("should throw error if role is invalid", async () => {

            await expect(
                updateUserRoleUseCase.execute(
                    "1",
                    "INVALID_ROLE"
                )
            ).rejects.toThrow(
                new AppError(
                    `Rol inválido. Roles válidos: ${Object.values(ROLES).join(", ")}`,
                    400
                )
            );

        });

        test("should throw error if user does not exist", async () => {

            mockUserRepository.findById.mockResolvedValue(null);

            await expect(
                updateUserRoleUseCase.execute(
                    "1",
                    ROLES.ADMIN
                )
            ).rejects.toThrow(
                new AppError("Usuario no encontrado", 404)
            );

            expect(mockUserRepository.findById)
                .toHaveBeenCalledWith("1");

        });

        test("should throw error if user already has the same role", async () => {

            mockUserRepository.findById.mockResolvedValue({
                id: "1",
                username: "Samuel",
                email: "samuel@gmail.com",
                role: ROLES.ADMIN,
            });

            await expect(
                updateUserRoleUseCase.execute(
                    "1",
                    ROLES.ADMIN
                )
            ).rejects.toThrow(
                new AppError(
                    "El usuario ya tiene este rol",
                    400
                )
            );

        });

    });

});