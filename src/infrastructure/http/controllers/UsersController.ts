import { Request, Response } from "express";
import { GetUserProfileUseCase } from "../../../application/use-cases/users/GetUserProfileUseCase";
import { UpdateMyProfileUseCase } from "../../../application/use-cases/users/UpdateMyProfileUseCase";
import { DiscoverPilotsUseCase } from "../../../application/use-cases/users/DiscoverPilotsUseCase";
import { AppError } from "../../../shared/errors/AppError";

export class UsersController {
    constructor(
        private getUserProfileUseCase: GetUserProfileUseCase,
        private updateMyProfileUseCase: UpdateMyProfileUseCase,
        private discoverPilotsUseCase: DiscoverPilotsUseCase
    ) { }

    getMe = async (req: any, res: Response) => {
        const userId = req.user.sub;

        const user = await this.getUserProfileUseCase.execute(userId);

        return res.json({
            success: true,
            data: user,
            message: "Perfil obtenido correctamente"
        });
    };

    getById = async (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id || Array.isArray(id)) {
            throw new AppError("ID inválido", 400);
        }

        const user = await this.getUserProfileUseCase.execute(id);

        return res.json({
            success: true,
            data: user,
            message: "Usuario obtenido correctamente"
        });
    };

    updateMe = async (req: any, res: Response) => {
        const userId = req.user.sub;

        const allowedFields = [
            "username",
            "profilePhoto",
            "locality",
            "city",
            "state",
            "country"
        ];

        const data = Object.fromEntries(
            Object.entries(req.body).filter(([key]) => allowedFields.includes(key))
        );

        const user = await this.updateMyProfileUseCase.execute(userId, data);

        return res.json({
            success: true,
            data: user,
            message: "Perfil actualizado correctamente"
        });
    };

    discoverPilots = async (req: any, res: Response) => {
        const userId = req.user?.sub;

        if (!userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        const pilots = await this.discoverPilotsUseCase.execute({
            userId,
            page,
            limit,
            locality: req.query.locality as string,
            city: req.query.city as string,
            state: req.query.state as string,
            country: req.query.country as string,
        });

        return res.json({
            success: true,
            data: pilots,
            message: "Pilotos disponibles consultados correctamente"
        });
    };
}