import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { AppError } from "../../../shared/errors/AppError";
import { ChallengeMapper } from "../../mappers/ChallengeMapper";

export class GetChallengeByIdUseCase {
    async execute(challengeId: string, userId: string) {
        const challenge = await prisma.challenge.findUnique({
            where: { id: challengeId },
            include: {
                challenger: true,
                challenged: true,
            },
        });

        if (!challenge) {
            throw new AppError("Reto no encontrado", 404);
        }

        if (challenge.challengerId !== userId && challenge.challengedId !== userId) {
            throw new AppError("No tienes acceso a este reto", 403);
        }

        const vehicles = await prisma.vehicle.findMany({
            where: {
                id: {
                    in: [
                        challenge.challengerVehicleId,
                        challenge.challengedVehicleId,
                    ].filter(Boolean) as string[],
                },
            },
        });

        const challengerVehicle = vehicles.find(
            (vehicle) => vehicle.id === challenge.challengerVehicleId
        );

        const challengedVehicle = vehicles.find(
            (vehicle) => vehicle.id === challenge.challengedVehicleId
        );

        return ChallengeMapper.toResponse({
            ...challenge,
            challengerVehicle,
            challengedVehicle,
        });
    }
}