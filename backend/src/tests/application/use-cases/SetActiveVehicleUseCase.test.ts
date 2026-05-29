import { SetActiveVehicleUseCase } from "../../../application/use-cases/vehicles/SetActiveVehicleUseCase";
import { VehicleMapper } from "../../../application/mappers/VehicleMapper";
import { AppError } from "../../../shared/errors/AppError";

jest.mock("../../../application/mappers/VehicleMapper", () => ({
    VehicleMapper: {
        toVehicleDto: jest.fn(),
    },
}));

describe("SetActiveVehicleUseCase", () => {

    let mockVehicleRepository: any;

    let setActiveVehicleUseCase: SetActiveVehicleUseCase;

    beforeEach(() => {

        mockVehicleRepository = {
            findById: jest.fn(),
            deactivateAllByUserId: jest.fn(),
            setActive: jest.fn(),
        };

        setActiveVehicleUseCase =
            new SetActiveVehicleUseCase(
                mockVehicleRepository
            );

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should set vehicle as active successfully", async () => {

            const mockVehicle = {
                id: "vehicle-1",
                userId: "user-1",
                brand: "Yamaha",
            };

            const activeVehicle = {
                id: "vehicle-1",
                userId: "user-1",
                active: true,
            };

            const mappedVehicle = {
                id: "vehicle-1",
                active: true,
            };

            mockVehicleRepository.findById
                .mockResolvedValue(mockVehicle);

            mockVehicleRepository.deactivateAllByUserId
                .mockResolvedValue(undefined);

            mockVehicleRepository.setActive
                .mockResolvedValue(activeVehicle);

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue(mappedVehicle);

            const result =
                await setActiveVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1"
                );

            expect(result).toEqual(mappedVehicle);

            expect(mockVehicleRepository.findById)
                .toHaveBeenCalledWith("vehicle-1");

            expect(mockVehicleRepository.deactivateAllByUserId)
                .toHaveBeenCalledWith("user-1");

            expect(mockVehicleRepository.setActive)
                .toHaveBeenCalledWith("vehicle-1");

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledWith(activeVehicle);

        });

        test("should throw error if vehicle does not exist", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue(null);

            await expect(
                setActiveVehicleUseCase.execute(
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

        test("should throw error if user has no permission to activate vehicle", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-1",
                    userId: "another-user",
                });

            await expect(
                setActiveVehicleUseCase.execute(
                    "user-1",
                    "vehicle-1"
                )
            ).rejects.toThrow(
                new AppError(
                    "No tienes permisos para activar este vehículo",
                    403
                )
            );

        });

        test("should deactivate previous active vehicles before activating new one", async () => {

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-99",
                    userId: "user-99",
                });

            mockVehicleRepository.deactivateAllByUserId
                .mockResolvedValue(undefined);

            mockVehicleRepository.setActive
                .mockResolvedValue({
                    id: "vehicle-99",
                });

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue({
                    id: "vehicle-99",
                });

            await setActiveVehicleUseCase.execute(
                "user-99",
                "vehicle-99"
            );

            expect(mockVehicleRepository.deactivateAllByUserId)
                .toHaveBeenCalledTimes(1);

            expect(mockVehicleRepository.deactivateAllByUserId)
                .toHaveBeenCalledWith("user-99");

        });

        test("should call mapper correctly", async () => {

            const activeVehicle = {
                id: "vehicle-10",
                userId: "user-10",
                active: true,
            };

            mockVehicleRepository.findById
                .mockResolvedValue({
                    id: "vehicle-10",
                    userId: "user-10",
                });

            mockVehicleRepository.deactivateAllByUserId
                .mockResolvedValue(undefined);

            mockVehicleRepository.setActive
                .mockResolvedValue(activeVehicle);

            (VehicleMapper.toVehicleDto as jest.Mock)
                .mockReturnValue({
                    id: "vehicle-10",
                });

            await setActiveVehicleUseCase.execute(
                "user-10",
                "vehicle-10"
            );

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledTimes(1);

            expect(VehicleMapper.toVehicleDto)
                .toHaveBeenCalledWith(activeVehicle);

        });

    });

});