import { Request, Response } from "express";
import { CreateChallengeUseCase } from "../../../application/use-cases/challenges/CreateChallengeUseCase";
import { UpdateChallengeStatusUseCase } from "../../../application/use-cases/challenges/UpdateChallengeStatusUseCase";
import { GetChallengeByIdUseCase } from "../../../application/use-cases/challenges/GetChallengeByIdUseCase";

export class ChallengeController {
    async create(req: Request, res: Response) {
        const user = (req as any).user;

        const useCase = new CreateChallengeUseCase();
        const challenge = await useCase.execute(user.sub, req.body);

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
        const challenge = await useCase.complete(id, user.sub, winnerId);

        return res.status(200).json({
            success: true,
            data: challenge,
            message: "Reto completado correctamente",
        });
    }
}