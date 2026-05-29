import { VehicleRepository } from "../../../domain/repositories/VehicleRepository";
import { AppError } from "../../../shared/errors/AppError";

export class DeleteVehicleUseCase {
    constructor(private vehicleRepository: VehicleRepository) { }

    async execute(userId: string, vehicleId: string) {
        const vehicle = await this.vehicleRepository.findById(vehicleId);

        if (!vehicle) {
            throw new AppError("Vehículo no encontrado", 404);
        }

        if (vehicle.userId !== userId) {
            throw new AppError("No tienes permisos para eliminar este vehículo", 403);
        }

        await this.vehicleRepository.delete(vehicleId);
    }
}