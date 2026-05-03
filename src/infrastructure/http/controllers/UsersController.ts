import { Request, Response } from "express";
import { GetUserProfileUseCase } from "../../../application/use-cases/users/GetUserProfileUseCase";
import { UpdateMyProfileUseCase } from "../../../application/use-cases/users/UpdateMyProfileUseCase";
import { AppError } from "../../../shared/errors/AppError";

export class UsersController {
    constructor(
        private getUserProfileUseCase: GetUserProfileUseCase,
        private updateMyProfileUseCase: UpdateMyProfileUseCase
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
}