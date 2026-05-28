import { GetMyVehiclesUseCase } from "../../../application/use-cases/vehicles/GetMyVehiclesUseCase";
import { VehicleMapper } from "../../../application/mappers/VehicleMapper";

jest.mock("../../../application/mappers/VehicleMapper", () => ({
    VehicleMapper: {
        toVehicleDtoList: jest.fn(),
    },
}));

describe("GetMyVehiclesUseCase", () => {

    let mockVehicleRepository: any;

    let getMyVehiclesUseCase: GetMyVehiclesUseCase;

    beforeEach(() => {

        mockVehicleRepository = {
            findByUserId: jest.fn(),
        };

        getMyVehiclesUseCase =
            new GetMyVehiclesUseCase(
                mockVehicleRepository
            );

        jest.clearAllMocks();

    });

    describe("execute", () => {

        test("should return user vehicles successfully", async () => {

            const mockVehicles = [
                {
                    id: "vehicle-1",
                    brand: "Yamaha",
                },
                {
                    id: "vehicle-2",
                    brand: "Honda",
                },
            ];

            const mappedVehicles = [
                {
                    id: "vehicle-1",
                    brand: "Yamaha",
                },
                {
                    id: "vehicle-2",
                    brand: "Honda",
                },
            ];

            mockVehicleRepository.findByUserId
                .mockResolvedValue(mockVehicles);

            (VehicleMapper.toVehicleDtoList as jest.Mock)
                .mockReturnValue(mappedVehicles);

            const result =
                await getMyVehiclesUseCase.execute(
                    "user-1"
                );

            expect(result).toEqual(mappedVehicles);

            expect(mockVehicleRepository.findByUserId)
                .toHaveBeenCalledWith("user-1");

            expect(VehicleMapper.toVehicleDtoList)
                .toHaveBeenCalledWith(mockVehicles);

        });

        test("should return empty array if user has no vehicles", async () => {

            mockVehicleRepository.findByUserId
                .mockResolvedValue([]);

            (VehicleMapper.toVehicleDtoList as jest.Mock)
                .mockReturnValue([]);

            const result =
                await getMyVehiclesUseCase.execute(
                    "user-1"
                );

            expect(result).toEqual([]);

            expect(VehicleMapper.toVehicleDtoList)
                .toHaveBeenCalledWith([]);

        });

        test("should call mapper correctly", async () => {

            const mockVehicles = [
                {
                    id: "vehicle-99",
                },
            ];

            mockVehicleRepository.findByUserId
                .mockResolvedValue(mockVehicles);

            (VehicleMapper.toVehicleDtoList as jest.Mock)
                .mockReturnValue([
                    {
                        id: "vehicle-99",
                    },
                ]);

            await getMyVehiclesUseCase.execute(
                "user-99"
            );

            expect(VehicleMapper.toVehicleDtoList)
                .toHaveBeenCalledTimes(1);

            expect(VehicleMapper.toVehicleDtoList)
                .toHaveBeenCalledWith(mockVehicles);

        });

    });

});