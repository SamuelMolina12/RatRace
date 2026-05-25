import { Request, Response } from "express";
import { CreateChallengeUseCase } from "../../../application/use-cases/challenges/CreateChallengeUseCase";
import { UpdateChallengeStatusUseCase } from "../../../application/use-cases/challenges/UpdateChallengeStatusUseCase";
import { GetChallengeByIdUseCase } from "../../../application/use-cases/challenges/GetChallengeByIdUseCase";
import { GetMyChallengesUseCase } from "../../../application/use-cases/challenges/GetMyChallengesUseCase";
import { GetUserChallengesUseCase } from "../../../application/use-cases/challenges/GetUserChallengesUseCase";
import { Server } from "socket.io";
import { emitToUser, emitToUsers } from "../../websocket/socket.emitter";
import { SOCKET_EVENT } from "../../../shared/constants/socket-event.constants";
import { NotificationService } from "../../../application/services/NotificationService";
import { NOTIFICATION_TYPE } from "../../../shared/constants/notification.constants";

export class ChallengeController {
    async create(req: Request, res: Response) {
        const user = (req as any).user;
        const useCase = new CreateChallengeUseCase();

        const challenge = await useCase.execute(user.sub, req.body);

        const io = req.app.get("io") as Server;

        emitToUser(io, challenge.challengedId, SOCKET_EVENT.CHALLENGE_RECEIVED, {
            challenge,
            message: "Has recibido un nuevo reto",
        });

        await NotificationService.createAndEmit(io, {
            userId: challenge.challengedId,
            type: NOTIFICATION_TYPE.CHALLENGE_RECEIVED,
            message: "Has recibido un nuevo reto",
            referenceId: challenge.id,
            data: challenge,
        });

        return res.status(201).json({
            success: true,
            data: challenge,
            message: "Reto creado correctamente",
        });
    }
    async accept(req: Request, res: Response) {
        const user = (req as any).user;
        const id = req.params.id as string;

        const useCase = new UpdateChallengeStatusUseCase();
        const challenge = await useCase.accept(id, user.sub);

        const io = req.app.get("io") as Server;

        emitToUser(io, challenge.challengerId, SOCKET_EVENT.CHALLENGE_ACCEPTED, {
            challenge,
            message: "Tu reto fue aceptado",
        });

        await NotificationService.createAndEmit(io, {
            userId: challenge.challengerId,
            type: NOTIFICATION_TYPE.CHALLENGE_ACCEPTED,
            message: "Tu rival aceptó el reto",
            referenceId: challenge.id,
            data: challenge,
        });
        return res.status(200).json({
            success: true,
            data: challenge,
            message: "Reto aceptado correctamente",
        });
    }

    async reject(req: Request, res: Response) {
        const user = (req as any).user;
        const id = req.params.id as string;

        const useCase = new UpdateChallengeStatusUseCase();
        const challenge = await useCase.reject(id, user.sub);

        const io = req.app.get("io") as Server;

        emitToUser(io, challenge.challengerId, SOCKET_EVENT.CHALLENGE_REJECTED, {
            challenge,
            message: "Tu reto fue rechazado",
        });

        await NotificationService.createAndEmit(io, {
            userId: challenge.challengerId,
            type: NOTIFICATION_TYPE.CHALLENGE_REJECTED,
            message: "Tu rival rechazó el reto",
            referenceId: challenge.id,
            data: challenge,
        });

        return res.status(200).json({
            success: true,
            data: challenge,
            message: "Reto rechazado correctamente",
        });
    }

    async cancel(req: Request, res: Response) {
        const user = (req as any).user;
        const id = req.params.id as string;

        const useCase = new UpdateChallengeStatusUseCase();
        const challenge = await useCase.cancel(id, user.sub);

        const io = req.app.get("io") as Server;

        emitToUser(io, challenge.challengedId, SOCKET_EVENT.CHALLENGE_CANCELLED, {
            challenge,
            message: "El reto fue cancelado",
        });

        await NotificationService.createAndEmit(io, {
            userId: challenge.challengedId,
            type: NOTIFICATION_TYPE.CHALLENGE_CANCELLED,
            message: "El otro piloto canceló el reto",
            referenceId: challenge.id,
            data: challenge,
        });

        return res.status(200).json({
            success: true,
            data: challenge,
            message: "Reto cancelado correctamente",
        });
    }

    async findById(req: Request, res: Response) {
        const user = (req as any).user;
        const id = req.params.id as string;

        const useCase = new GetChallengeByIdUseCase();
        const challenge = await useCase.execute(id, user.sub);

        return res.status(200).json({
            success: true,
            data: challenge,
            message: "Reto encontrado",
        });
    }

    async start(req: Request, res: Response) {
        const user = (req as any).user;
        const id = req.params.id as string;

        const useCase = new UpdateChallengeStatusUseCase();
        const challenge = await useCase.start(id, user.sub);

        const io = req.app.get("io") as Server;

        emitToUsers(
            io,
            [challenge.challengerId, challenge.challengedId],
            SOCKET_EVENT.CHALLENGE_STARTED,
            {
                challenge,
                message: "El reto inició",
            }
        );

        await Promise.all([
            NotificationService.createAndEmit(io, {
                userId: challenge.challengerId,
                type: NOTIFICATION_TYPE.CHALLENGE_STARTED,
                message: "El reto está en curso",
                referenceId: challenge.id,
                data: challenge,
            }),
            NotificationService.createAndEmit(io, {
                userId: challenge.challengedId,
                type: NOTIFICATION_TYPE.CHALLENGE_STARTED,
                message: "El reto está en curso",
                referenceId: challenge.id,
                data: challenge,
            }),
        ]);

        return res.status(200).json({
            success: true,
            data: challenge,
            message: "Reto iniciado correctamente",
        });
    }
    async complete(req: Request, res: Response) {
        const user = (req as any).user;
        const id = req.params.id as string;
        const { winnerId } = req.body;

        const useCase = new UpdateChallengeStatusUseCase();
        const result = await useCase.complete(id, user.sub, winnerId);

        const challenge = (result as any).challenge ?? result;
        const ranking = (result as any).ranking;

        const io = req.app.get("io") as Server;

        emitToUsers(
            io,
            [challenge.challengerId, challenge.challengedId],
            SOCKET_EVENT.CHALLENGE_COMPLETED,
            {
                challenge,
                ranking,
                message: "El reto fue completado",
            }
        );

        await Promise.all([
            NotificationService.createAndEmit(io, {
                userId: challenge.challengerId,
                type: NOTIFICATION_TYPE.CHALLENGE_COMPLETED,
                message: "Ya se registró el resultado del reto",
                referenceId: challenge.id,
                data: {
                    challenge,
                    ranking,
                },
            }),
            NotificationService.createAndEmit(io, {
                userId: challenge.challengedId,
                type: NOTIFICATION_TYPE.CHALLENGE_COMPLETED,
                message: "Ya se registró el resultado del reto",
                referenceId: challenge.id,
                data: {
                    challenge,
                    ranking,
                },
            }),
        ]);

        if (ranking?.winner?.rankedUp) {
            emitToUser(io, ranking.winner.id, SOCKET_EVENT.RANK_UPGRADED, {
                previousRank: ranking.winner.previousRank,
                currentRank: ranking.winner.currentRank,
                message: `Subiste al rango ${ranking.winner.currentRank}`,
            });

            await NotificationService.createAndEmit(io, {
                userId: ranking.winner.id,
                type: NOTIFICATION_TYPE.RANK_UPGRADED,
                message: `Felicidades, ahora eres rango ${ranking.winner.currentRank}`,
                referenceId: challenge.id,
                data: ranking.winner,
            });
        }

        return res.status(200).json({
            success: true,
            data: result,
            message: "Reto completado correctamente",
        });
    }

    async findMyChallenges(req: Request, res: Response) {
        const user = (req as any).user;
        const { status } = req.query;

        const useCase = new GetMyChallengesUseCase();

        const challenges = await useCase.execute(
            user.sub,
            status ? String(status) : undefined
        );

        return res.status(200).json({
            success: true,
            data: challenges,
            message: "Retos del usuario encontrados",
        });
    }

    async findUserChallenges(req: Request, res: Response) {
        const userId = req.params.userId as string;

        const useCase = new GetUserChallengesUseCase();
        const challenges = await useCase.execute(userId);

        return res.status(200).json({
            success: true,
            data: challenges,
            message: "Retos del usuario encontrados",
        });
    }
}