import { VehicleRepository } from "../../../domain/repositories/VehicleRepository";
import { VehicleMapper } from "../../mappers/VehicleMapper";
import { AppError } from "../../../shared/errors/AppError";

export class UpdateVehicleUseCase {
    constructor(private vehicleRepository: VehicleRepository) { }

    async execute(userId: string, vehicleId: string, data: any) {
        const vehicle = await this.vehicleRepository.findById(vehicleId);

        if (!vehicle) {
            throw new AppError("Vehículo no encontrado", 404);
        }

        if (vehicle.userId !== userId) {
            throw new AppError("No tienes permisos para actualizar este vehículo", 403);
        }

        const allowedFields = [
            "vehicleType",
            "brand",
            "model",
            "year",
            "color",
            "plate",
            "photo",
            "modifications"
        ];

        const updateData = Object.fromEntries(
            Object.entries(data).filter(([key]) => allowedFields.includes(key))
        );

        if (Object.keys(updateData).length === 0) {
            throw new AppError("No hay campos válidos para actualizar", 400);
        }


        if (updateData.year !== undefined) {
            updateData.year = Number(updateData.year);
        }

        const updatedVehicle = await this.vehicleRepository.update(vehicleId, updateData);

        return VehicleMapper.toVehicleDto(updatedVehicle);
    }
}