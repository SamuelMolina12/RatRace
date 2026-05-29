import { Request, Response } from "express";
import { CreateVehicleUseCase } from "../../../application/use-cases/vehicles/CreateVehicleUseCase";
import { DeleteVehicleUseCase } from "../../../application/use-cases/vehicles/DeleteVehicleUseCase";
import { GetMyVehiclesUseCase } from "../../../application/use-cases/vehicles/GetMyVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../../../application/use-cases/vehicles/GetVehicleByIdUseCase";
import { SetActiveVehicleUseCase } from "../../../application/use-cases/vehicles/SetActiveVehicleUseCase";
import { UpdateVehicleUseCase } from "../../../application/use-cases/vehicles/UpdateVehicleUseCase";
import { AppError } from "../../../shared/errors/AppError";

export class VehiclesController {
    constructor(
        private createVehicleUseCase: CreateVehicleUseCase,
        private getMyVehiclesUseCase: GetMyVehiclesUseCase,
        private getVehicleByIdUseCase: GetVehicleByIdUseCase,
        private updateVehicleUseCase: UpdateVehicleUseCase,
        private deleteVehicleUseCase: DeleteVehicleUseCase,
        private setActiveVehicleUseCase: SetActiveVehicleUseCase
    ) { }

    create = async (req: any, res: Response) => {
        const userId = req.user?.sub;

        if (!userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        const vehicle = await this.createVehicleUseCase.execute(userId, req.body);

        return res.status(201).json({
            success: true,
            data: vehicle,
            message: "Vehículo registrado correctamente"
        });
    };

    getMyVehicles = async (req: any, res: Response) => {
        const userId = req.user?.sub;

        if (!userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        const vehicles = await this.getMyVehiclesUseCase.execute(userId);

        return res.json({
            success: true,
            data: vehicles,
            message: "Vehículos obtenidos correctamente"
        });
    };

    getById = async (req: Request<{ id: string }> | any, res: Response) => {
        const userId = req.user?.sub;
        const { id } = req.params;

        if (!userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        const vehicle = await this.getVehicleByIdUseCase.execute(userId, id);

        return res.json({
            success: true,
            data: vehicle,
            message: "Vehículo obtenido correctamente"
        });
    };

    update = async (req: Request<{ id: string }> | any, res: Response) => {
        const userId = req.user?.sub;
        const { id } = req.params;

        if (!userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        const vehicle = await this.updateVehicleUseCase.execute(userId, id, req.body);

        return res.json({
            success: true,
            data: vehicle,
            message: "Vehículo actualizado correctamente"
        });
    };

    delete = async (req: Request<{ id: string }> | any, res: Response) => {
        const userId = req.user?.sub;
        const { id } = req.params;

        if (!userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        await this.deleteVehicleUseCase.execute(userId, id);

        return res.json({
            success: true,
            data: null,
            message: "Vehículo eliminado correctamente"
        });
    };

    setActive = async (req: Request<{ id: string }> | any, res: Response) => {
        const userId = req.user?.sub;
        const { id } = req.params;

        if (!userId) {
            throw new AppError("Usuario no autenticado", 401);
        }

        const vehicle = await this.setActiveVehicleUseCase.execute(userId, id);

        return res.json({
            success: true,
            data: vehicle,
            message: "Vehículo activo actualizado correctamente"
        });
    };
}