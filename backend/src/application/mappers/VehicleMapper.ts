import { Vehicle } from "@prisma/client";
import { VehicleDto } from "../dtos/VehicleDto";

export class VehicleMapper {
  static toVehicleDto(vehicle: Vehicle): VehicleDto {
    return {
      id: vehicle.id,
      userId: vehicle.userId,
      vehicleType: vehicle.vehicleType,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      color: vehicle.color,
      plate: vehicle.plate,
      photo: vehicle.photo,
      modifications: vehicle.modifications,
      active: vehicle.active,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.updatedAt
    };
  }

  static toVehicleDtoList(vehicles: Vehicle[]): VehicleDto[] {
    return vehicles.map((vehicle) => this.toVehicleDto(vehicle));
  }
}