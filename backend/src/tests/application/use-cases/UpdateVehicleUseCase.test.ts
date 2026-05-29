import { UpdateVehicleUseCase } from "../../../application/use-cases/vehicles/UpdateVehicleUseCase";
import { VehicleMapper } from "../../../application/mappers/VehicleMapper";
import { AppError } from "../../../shared/errors/AppError";

jest.mock("../../../application/mappers/VehicleMapper", () => ({
    VehicleMapper: {
        toVehicleDto: jest.fn(),
    },
}));

describe("UpdateVehicleUseCase", () => {

    let mockVehicleRepository: any;

    let updateVehicleUseCase: UpdateVehicleUseCase;

    beforeEach(() => {

        mockVehicleRepository = {
            findById: jest.fn(),
            update: jest.fn(),
        };

        updateVehicleUseCase =
            new UpdateVehicleUseCase(
                mockVehicleRepository
            );

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should update vehicle successfully", async () => {

            const mockVehicle = {
                id: "vehicle-1",
                userId: "user-1",
            };

            const updatedVehicle = {
                id: "vehicle-1",
                brand: "Yamaha",
                model: "R6",
                year: 2020,
            };

            const mappedVehicle = {
                id: "vehicle-1",
                brand: "Yamaha",
            };

            mockVehicleRepository.findById
                .mockResolvedValue(mockVehicle);

            mockVehicleRepository.update
                .mockResolvedValue(updatedVehicle);

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue(mappedVehicle);

            const result =
                await updateVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1",
                    {
                        brand: "Yamaha",
                        model: "R6",
                        year: "2020",
                    }
                );

            expect(result).toEqual(mappedVehicle);

            expect(mockVehicleRepository.update)
                .toHaveBeenCalledWith(
                    "vehicle-1",
                    {
                        brand: "Yamaha",
                        model: "R6",
                        year: 2020,
                    }
                );

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledWith(updatedVehicle);

        });

        test("should throw error if vehicle does not exist", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue(null);

            await expect(
                updateVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1",
                    {
                        brand: "Yamaha",
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Vehículo no encontrado",
                    404
                )
            );

        });

        test("should throw error if user has no permission to update vehicle", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-1",
                    userId: "another-user",
                });

            await expect(
                updateVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1",
                    {
                        brand: "Yamaha",
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "No tienes permisos para actualizar este vehículo",
                    403
                )
            );

        });

        test("should throw error if there are no valid fields to update", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-1",
                    userId: "user-1",
                });

            await expect(
                updateVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1",
                    {
                        invalidField: "test",
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "No hay campos válidos para actualizar",
                    400
                )
            );

        });

        test("should filter invalid fields before updating", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-10",
                    userId: "user-10",
                });

            mockVehicleRepository.update
                .mockResolvedValue({
                    id: "vehicle-10",
                });

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue({
                    id: "vehicle-10",
                });

            await updateVehicleUseCase.execute(
                "user-10",
                "vehicle-10",
                {
                    brand: "Honda",
                    invalidField: "invalid",
                }
            );

            expect(mockVehicleRepository.update)
                .toHaveBeenCalledWith(
                    "vehicle-10",
                    {
                        brand: "Honda",
                    }
                );

        });

        test("should convert year to number before updating", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-20",
                    userId: "user-20",
                });

            mockVehicleRepository.update
                .mockResolvedValue({
                    id: "vehicle-20",
                    year: 2024,
                });

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue({
                    id: "vehicle-20",
                });

            await updateVehicleUseCase.execute(
                "user-20",
                "vehicle-20",
                {
                    year: "2024",
                }
            );

            expect(mockVehicleRepository.update)
                .toHaveBeenCalledWith(
                    "vehicle-20",
                    {
                        year: 2024,
                    }
                );

        });

        test("should call mapper correctly", async () => {

            const updatedVehicle = {
                id: "vehicle-99",
                userId: "user-99",
            };

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-99",
                    userId: "user-99",
                });

            mockVehicleRepository.update
                .mockResolvedValue(updatedVehicle);

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue({
                    id: "vehicle-99",
                });

            await updateVehicleUseCase.execute(
                "user-99",
                "vehicle-99",
                {
                    brand: "BMW",
                }
            );

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledTimes(1);

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledWith(updatedVehicle);

        });

    });

});