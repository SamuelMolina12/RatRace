import { VehicleRepository } from "../../../domain/repositories/VehicleRepository";
import { VehicleMapper } from "../../mappers/VehicleMapper";

export class GetMyVehiclesUseCase {
    constructor(private vehicleRepository: VehicleRepository) { }

    async execute(userId: string) {
        const vehicles = await this.vehicleRepository.findByUserId(userId);

        return VehicleMapper.toVehicleDtoList(vehicles);
    }
}