import { DeleteVehicleUseCase } from "../../../application/use-cases/vehicles/DeleteVehicleUseCase";
import { AppError } from "../../../shared/errors/AppError";

describe("DeleteVehicleUseCase", () => {

    let mockVehicleRepository: any;

    let deleteVehicleUseCase: DeleteVehicleUseCase;

    beforeEach(() => {

        mockVehicleRepository = {
            findById: jest.fn(),
            delete: jest.fn(),
        };

        deleteVehicleUseCase =
            new DeleteVehicleUseCase(
                mockVehicleRepository
            );

    });

    describe("execute", () => {

        test("should delete vehicle successfully", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-1",
                    userId: "user-1",
                });

            mockVehicleRepository.delete
                .mockResolvedValue(undefined);

            const result =
                await deleteVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1"
                );

            expect(result).toBeUndefined();

            expect(mockVehicleRepository.findById)
                .toHaveBeenCalledWith("vehicle-1");

            expect(mockVehicleRepository.delete)
                .toHaveBeenCalledWith("vehicle-1");

        });

        test("should throw error if vehicle does not exist", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue(null);

            await expect(
                deleteVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1"
                )
            ).rejects.toThrow(
                new AppError(
                    "Vehículo no encontrado",
                    404
                )
            );

        });

        test("should throw error if user has no permission to delete vehicle", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-1",
                    userId: "another-user",
                });

            await expect(
                deleteVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1"
                )
            ).rejects.toThrow(
                new AppError(
                    "No tienes permisos para eliminar este vehículo",
                    403
                )
            );

        });

        test("should call delete with correct vehicleId", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-99",
                    userId: "user-1",
                });

            mockVehicleRepository.delete
                .mockResolvedValue(undefined);

            await deleteVehicleUseCase.execute(
                "user-1",
                "vehicle-99"
            );

            expect(mockVehicleRepository.delete)
                .toHaveBeenCalledTimes(1);

            expect(mockVehicleRepository.delete)
                .toHaveBeenCalledWith("vehicle-99");

        });

    });

});