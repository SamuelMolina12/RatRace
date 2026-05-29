import { VehicleRepository } from "../../../domain/repositories/VehicleRepository";
import { VehicleMapper } from "../../mappers/VehicleMapper";
import { AppError } from "../../../shared/errors/AppError";

export class CreateVehicleUseCase {
    constructor(private vehicleRepository: VehicleRepository) { }

    async execute(userId: string, data: any) {
        const vehicleCount = await this.vehicleRepository.countByUserId(userId);

        if (vehicleCount >= 3) {
            throw new AppError("No puedes registrar más de 3 vehículos", 400);
        }

        if (!data.vehicleType || !data.brand || !data.model || !data.year || !data.color) {
            throw new AppError("Faltan campos obligatorios del vehículo", 400);
        }

        if (data.active) {
            await this.vehicleRepository.deactivateAllByUserId(userId);
        }

        const vehicle = await this.vehicleRepository.create({
            userId,
            vehicleType: data.vehicleType,
            brand: data.brand,
            model: data.model,
            year: Number(data.year),
            color: data.color,
            plate: data.plate,
            photo: data.photo,
            modifications: data.modifications,
            active: Boolean(data.active)
        });

        return VehicleMapper.toVehicleDto(vehicle);
    }
}