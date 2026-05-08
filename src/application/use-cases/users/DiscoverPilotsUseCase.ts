import { UserRepository } from "../../../domain/repositories/UserRepository";
import { AppError } from "../../../shared/errors/AppError";

interface DiscoverPilotsRequest {
    userId: string;
    page: number;
    limit: number;
    locality?: string;
    city?: string;
    state?: string;
    country?: string;
}

export class DiscoverPilotsUseCase {
    constructor(private readonly userRepository: UserRepository) { }

    async execute(request: DiscoverPilotsRequest) {
        if (!request.userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        const page = request.page > 0 ? request.page : 1;
        const limit = request.limit > 0 ? request.limit : 10;

        const authenticatedUser = await this.userRepository.findById(request.userId);

        if (!authenticatedUser) {
            throw new AppError("Usuario autenticado no encontrado", 404);
        }

        const activeVehicle = await this.userRepository.findActiveVehicleByUserId(
            request.userId
        );

        if (!activeVehicle) {
            throw new AppError(
                "Debes tener un vehículo activo para descubrir pilotos",
                400
            );
        }

        return this.userRepository.findDiscoverablePilots({
            userId: request.userId,
            rank: authenticatedUser.rank,
            vehicleType: activeVehicle.vehicleType,
            page,
            limit,
            locality: request.locality,
            city: request.city,
            state: request.state,
            country: request.country,
        });
    }
}