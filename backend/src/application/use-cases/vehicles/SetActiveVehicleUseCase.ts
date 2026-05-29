import { VehicleRepository } from "../../../domain/repositories/VehicleRepository";
import { VehicleMapper } from "../../mappers/VehicleMapper";
import { AppError } from "../../../shared/errors/AppError";

export class SetActiveVehicleUseCase {
    constructor(private vehicleRepository: VehicleRepository) { }

    async execute(userId: string, vehicleId: string) {
        const vehicle = await this.vehicleRepository.findById(vehicleId);

        if (!vehicle) {
            throw new AppError("Vehículo no encontrado", 404);
        }

        if (vehicle.userId !== userId) {
            throw new AppError("No tienes permisos para activar este vehículo", 403);
        }

        await this.vehicleRepository.deactivateAllByUserId(userId);

        const activeVehicle = await this.vehicleRepository.setActive(vehicleId);

        return VehicleMapper.toVehicleDto(activeVehicle);
    }
}