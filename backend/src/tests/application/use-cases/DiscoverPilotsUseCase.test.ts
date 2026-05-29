import { DiscoverPilotsUseCase } from "../../../application/use-cases/users/DiscoverPilotsUseCase";
import { AppError } from "../../../shared/errors/AppError";

describe("DiscoverPilotsUseCase", () => {

    let mockUserRepository: any;

    let discoverPilotsUseCase: DiscoverPilotsUseCase;

    beforeEach(() => {

        mockUserRepository = {
            findById: jest.fn(),
            findActiveVehicleByUserId: jest.fn(),
            findDiscoverablePilots: jest.fn(),
        };

        discoverPilotsUseCase =
            new DiscoverPilotsUseCase(
                mockUserRepository
            );

    });

    describe("execute", () => {

        test("should discover pilots successfully", async () => {

            mockUserRepository.findById
                .mockResolvedValue({
                    id: "user-1",
                    rank: "A",
                });

            mockUserRepository.findActiveVehicleByUserId
                .mockResolvedValue({
                    id: "vehicle-1",
                    vehicleType: "SPORT",
                });

            mockUserRepository.findDiscoverablePilots
                .mockResolvedValue([
                    {
                        id: "pilot-1",
                        username: "Samuel",
                    },
                ]);

            const result =
                await discoverPilotsUseCase.execute({
                    userId: "user-1",
                    page: 1,
                    limit: 10,
                    city: "Medellín",
                });

            expect(result).toEqual([
                {
                    id: "pilot-1",
                    username: "Samuel",
                },
            ]);

            expect(mockUserRepository.findDiscoverablePilots)
                .toHaveBeenCalledWith({
                    userId: "user-1",
                    rank: "A",
                    vehicleType: "SPORT",
                    page: 1,
                    limit: 10,
                    locality: undefined,
                    city: "Medellín",
                    state: undefined,
                    country: undefined,
                });

        });

        test("should throw error if user is not authenticated", async () => {

            await expect(
                discoverPilotsUseCase.execute({
                    userId: "",
                    page: 1,
                    limit: 10,
                })
            ).rejects.toThrow(
                new AppError(
                    "Usuario no autenticado",
                    401
                )
            );

        });

        test("should throw error if authenticated user does not exist", async () => {

            mockUserRepository.findById
                .mockResolvedValue(null);

            await expect(
                discoverPilotsUseCase.execute({
                    userId: "user-1",
                    page: 1,
                    limit: 10,
                })
            ).rejects.toThrow(
                new AppError(
                    "Usuario autenticado no encontrado",
                    404
                )
            );

        });

        test("should throw error if user has no active vehicle", async () => {

            mockUserRepository.findById
                .mockResolvedValue({
                    id: "user-1",
                    rank: "A",
                });

            mockUserRepository.findActiveVehicleByUserId
                .mockResolvedValue(null);

            await expect(
                discoverPilotsUseCase.execute({
                    userId: "user-1",
                    page: 1,
                    limit: 10,
                })
            ).rejects.toThrow(
                new AppError(
                    "Debes tener un vehículo activo para descubrir pilotos",
                    400
                )
            );

        });

        test("should use default page and limit values", async () => {

            mockUserRepository.findById
                .mockResolvedValue({
                    id: "user-1",
                    rank: "A",
                });

            mockUserRepository.findActiveVehicleByUserId
                .mockResolvedValue({
                    id: "vehicle-1",
                    vehicleType: "SPORT",
                });

            mockUserRepository.findDiscoverablePilots
                .mockResolvedValue([]);

            await discoverPilotsUseCase.execute({
                userId: "user-1",
                page: 0,
                limit: 0,
            });

            expect(mockUserRepository.findDiscoverablePilots)
                .toHaveBeenCalledWith({
                    userId: "user-1",
                    rank: "A",
                    vehicleType: "SPORT",
                    page: 1,
                    limit: 10,
                    locality: undefined,
                    city: undefined,
                    state: undefined,
                    country: undefined,
                });

        });

    });

});