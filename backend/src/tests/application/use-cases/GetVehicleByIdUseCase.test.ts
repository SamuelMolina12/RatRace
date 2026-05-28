import { GetVehicleByIdUseCase } from "../../../application/use-cases/vehicles/GetVehicleByIdUseCase";
import { VehicleMapper } from "../../../application/mappers/VehicleMapper";
import { AppError } from "../../../shared/errors/AppError";

jest.mock("../../../application/mappers/VehicleMapper", () => ({
    VehicleMapper: {
        toVehicleDto: jest.fn(),
    },
}));

describe("GetVehicleByIdUseCase", () => {

    let mockVehicleRepository: any;

    let getVehicleByIdUseCase: GetVehicleByIdUseCase;

    beforeEach(() => {

        mockVehicleRepository = {
            findById: jest.fn(),
        };

        getVehicleByIdUseCase =
            new GetVehicleByIdUseCase(
                mockVehicleRepository
            );

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should return vehicle successfully", async () => {

            const mockVehicle = {
                id: "vehicle-1",
                userId: "user-1",
                brand: "Yamaha",
            };

            const mappedVehicle = {
                id: "vehicle-1",
                brand: "Yamaha",
            };

            mockVehicleRepository.findById
                .mockResolvedValue(mockVehicle);

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue(mappedVehicle);

            const result =
                await getVehicleByIdUseCase.execute(
                    "user-1",
                    "vehicle-1"
                );

            expect(result).toEqual(mappedVehicle);

            expect(mockVehicleRepository.findById)
                .toHaveBeenCalledWith("vehicle-1");

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledWith(mockVehicle);

        });

        test("should throw error if vehicle does not exist", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue(null);

            await expect(
                getVehicleByIdUseCase.execute(
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

        test("should throw error if user has no permission to view vehicle", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-1",
                    userId: "another-user",
                });

            await expect(
                getVehicleByIdUseCase.execute(
                    "user-1",
                    "vehicle-1"
                )
            ).rejects.toThrow(
                new AppError(
                    "No tienes permisos para ver este vehículo",
                    403
                )
            );

        });

        test("should call mapper correctly", async () => {

            const mockVehicle = {
                id: "vehicle-99",
                userId: "user-99",
            };

            mockVehicleRepository.findById
                .mockResolvedValue(mockVehicle);

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue({
                    id: "vehicle-99",
                });

            await getVehicleByIdUseCase.execute(
                "user-99",
                "vehicle-99"
            );

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledTimes(1);

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledWith(mockVehicle);

        });

    });

});