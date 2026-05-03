import { CreateVehicleData, UpdateVehicleData, VehicleRepository } from "../../../domain/repositories/VehicleRepository";
import { prisma } from "./prisma.client";

export class PrismaVehicleRepository implements VehicleRepository {
    create(data: CreateVehicleData) {
        return prisma.vehicle.create({
            data
        });
    }

    findById(id: string) {
        return prisma.vehicle.findUnique({
            where: { id }
        });
    }

    findByUserId(userId: string) {
        return prisma.vehicle.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" }
        });
    }

    countByUserId(userId: string) {
        return prisma.vehicle.count({
            where: { userId }
        });
    }

    update(id: string, data: UpdateVehicleData) {
        return prisma.vehicle.update({
            where: { id },
            data
        });
    }

    async delete(id: string) {
        await prisma.vehicle.delete({
            where: { id }
        });
    }

    async deactivateAllByUserId(userId: string) {
        await prisma.vehicle.updateMany({
            where: { userId },
            data: { active: false }
        });
    }

    setActive(id: string) {
        return prisma.vehicle.update({
            where: { id },
            data: { active: true }
        });
    }
}