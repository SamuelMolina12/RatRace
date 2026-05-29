import { CreateVehicleUseCase } from "../../../application/use-cases/vehicles/CreateVehicleUseCase";
import { AppError } from "../../../shared/errors/AppError";
import { VehicleMapper } from "../../../application/mappers/VehicleMapper";

jest.mock("../../../application/mappers/VehicleMapper", () => ({
    VehicleMapper: {
        toVehicleDto: jest.fn(),
    },
}));

describe("CreateVehicleUseCase", () => {

    let mockVehicleRepository: any;

    let createVehicleUseCase: CreateVehicleUseCase;

    beforeEach(() => {

        mockVehicleRepository = {
            countByUserId: jest.fn(),
            deactivateAllByUserId: jest.fn(),
            create: jest.fn(),
        };

        createVehicleUseCase =
            new CreateVehicleUseCase(
                mockVehicleRepository
            );

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should create vehicle successfully", async () => {

            const mockVehicle = {
                id: "vehicle-1",
                brand: "Yamaha",
                model: "R6",
            };

            const mappedVehicle = {
                id: "vehicle-1",
                brand: "Yamaha",
            };

            mockVehicleRepository.countByUserId
                .mockResolvedValue(1);

            mockVehicleRepository.create
                .mockResolvedValue(mockVehicle);

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue(mappedVehicle);

            const result =
                await createVehicleUseCase.execute(
                    "user-1",
                    {
                        vehicleType: "SPORT",
                        brand: "Yamaha",
                        model: "R6",
                        year: 2020,
                        color: "Blue",
                        active: true,
                    }
                );

            expect(result).toEqual(mappedVehicle);

            expect(mockVehicleRepository.deactivateAllByUserId)
                .toHaveBeenCalledWith("user-1");

            expect(mockVehicleRepository.create)
                .toHaveBeenCalledWith({
                    userId: "user-1",
                    vehicleType: "SPORT",
                    brand: "Yamaha",
                    model: "R6",
                    year: 2020,
                    color: "Blue",
                    plate: undefined,
                    photo: undefined,
                    modifications: undefined,
                    active: true,
                });

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledWith(mockVehicle);

        });

        test("should throw error if user already has 3 vehicles", async () => {

            mockVehicleRepository.countByUserId
                .mockResolvedValue(3);

            await expect(
                createVehicleUseCase.execute(
                    "user-1",
                    {
                        vehicleType: "SPORT",
                        brand: "Yamaha",
                        model: "R6",
                        year: 2020,
                        color: "Blue",
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "No puedes registrar más de 3 vehículos",
                    400
                )
            );

        });

        test("should throw error if required fields are missing", async () => {

            mockVehicleRepository.countByUserId
                .mockResolvedValue(1);

            await expect(
                createVehicleUseCase.execute(
                    "user-1",
                    {
                        brand: "Yamaha",
                    }
                )
            ).rejects.toThrow(
                new AppError(
                    "Faltan campos obligatorios del vehículo",
                    400
                )
            );

        });

        test("should deactivate previous vehicles when active is true", async () => {

            mockVehicleRepository.countByUserId
                .mockResolvedValue(1);

            mockVehicleRepository.create
                .mockResolvedValue({
                    id: "vehicle-1",
                });

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue({
                    id: "vehicle-1",
                });

            await createVehicleUseCase.execute(
                "user-1",
                {
                    vehicleType: "SPORT",
                    brand: "Yamaha",
                    model: "R6",
                    year: 2020,
                    color: "Blue",
                    active: true,
                }
            );

            expect(mockVehicleRepository.deactivateAllByUserId)
                .toHaveBeenCalledTimes(1);

            expect(mockVehicleRepository.deactivateAllByUserId)
                .toHaveBeenCalledWith("user-1");

        });

        test("should convert year to number", async () => {

            mockVehicleRepository.countByUserId
                .mockResolvedValue(1);

            mockVehicleRepository.create
                .mockResolvedValue({
                    id: "vehicle-1",
                });

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue({
                    id: "vehicle-1",
                });

            await createVehicleUseCase.execute(
                "user-1",
                {
                    vehicleType: "SPORT",
                    brand: "Yamaha",
                    model: "R6",
                    year: "2020",
                    color: "Blue",
                }
            );

            expect(mockVehicleRepository.create)
                .toHaveBeenCalledWith({
                    userId: "user-1",
                    vehicleType: "SPORT",
                    brand: "Yamaha",
                    model: "R6",
                    year: 2020,
                    color: "Blue",
                    plate: undefined,
                    photo: undefined,
                    modifications: undefined,
                    active: false,
                });

        });

    });

});