import { prisma } from "../../../infrastructure/database/prisma/prisma.client";
import { ACTIVE_CHALLENGE_STATUSES, CHALLENGE_STATUS, RACE_TYPES } from "../../../shared/constants/challenge.constants";
import { AppError } from "../../../shared/errors/AppError";
import { CreateChallengeDto } from "../../dtos/CreateChallengeDto";

export class CreateChallengeUseCase {
    async execute(challengerId: string, data: CreateChallengeDto) {
        const { challengedId, raceType, agreedLocation, agreedDate, notes } = data;

        if (!challengedId) {
            throw new AppError("El piloto retado es obligatorio", 400);
        }

        if (challengerId === challengedId) {
            throw new AppError("No puedes retarte a ti mismo", 400);
        }

        if (!Object.values(RACE_TYPES).includes(raceType as any)) {
            throw new AppError("Tipo de carrera no válido", 400);
        }

        const challenger = await prisma.user.findUnique({
            where: { id: challengerId },
        });

        if (!challenger) {
            throw new AppError("Piloto retador no encontrado", 404);
        }

        const challenged = await prisma.user.findUnique({
            where: { id: challengedId },
        });

        if (!challenged) {
            throw new AppError("Piloto retado no encontrado", 404);
        }

        if (challenger.rank !== challenged.rank) {
            throw new AppError("Solo puedes retar pilotos del mismo rango", 400);
        }

        const challengerVehicle = await prisma.vehicle.findFirst({
            where: {
                userId: challengerId,
                active: true,
            },
        });

        if (!challengerVehicle) {
            throw new AppError("Debes tener un vehículo activo para retar", 400);
        }

        const challengedVehicle = await prisma.vehicle.findFirst({
            where: {
                userId: challengedId,
                active: true,
            },
        });

        if (!challengedVehicle) {
            throw new AppError("El piloto retado no tiene vehículo activo", 400);
        }

        if (challengerVehicle.vehicleType !== challengedVehicle.vehicleType) {
            throw new AppError(
                "Solo puedes retar pilotos con el mismo tipo de vehículo activo",
                400
            );
        }

        const existingChallenge = await prisma.challenge.findFirst({
            where: {
                status: {
                    in: ACTIVE_CHALLENGE_STATUSES,
                },
                OR: [
                    {
                        challengerId,
                        challengedId,
                    },
                    {
                        challengerId: challengedId,
                        challengedId: challengerId,
                    },
                ],
            },
        });

        if (existingChallenge) {
            throw new AppError("Ya existe un reto activo con este piloto", 400);
        }

        return prisma.challenge.create({
            data: {
                challengerId,
                challengedId,
                raceType,
                challengerVehicleId: challengerVehicle.id,
                challengedVehicleId: challengedVehicle.id,
                status: CHALLENGE_STATUS.PENDING,
                agreedLocation,
                agreedDate: agreedDate ? new Date(agreedDate) : null,
                notes,
            },
        });
    }
}