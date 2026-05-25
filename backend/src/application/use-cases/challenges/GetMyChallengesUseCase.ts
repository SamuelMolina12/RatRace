import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { ChallengeMapper } from "../../mappers/ChallengeMapper";

export class GetMyChallengesUseCase {
    async execute(userId: string, status?: string) {
        const challenges = await prisma.challenge.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { challengerId: userId },
                            { challengedId: userId },
                        ],
                    },
                    status ? { status } : {},
                ],
            },
            include: {
                challenger: true,
                challenged: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        const vehicleIds = challenges
            .flatMap((challenge) => [
                challenge.challengerVehicleId,
                challenge.challengedVehicleId,
            ])
            .filter(Boolean) as string[];

        const vehicles = await prisma.vehicle.findMany({
            where: {
                id: {
                    in: vehicleIds,
                },
            },
        });

        return challenges.map((challenge) => {
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
        });
    }
}