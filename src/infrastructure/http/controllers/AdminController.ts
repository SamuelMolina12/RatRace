import { Request, Response } from "express";
import { GetAllUsersUseCase } from "../../../application/use-cases/admin/GetAllUsersUseCase";
import { UpdateUserRoleUseCase } from "../../../application/use-cases/admin/UpdateUserRoleUseCase";
import { GetAllChallengesUseCase } from "../../../application/use-cases/admin/GetAllChallengesUseCase";
import { ResolveChallengeUseCase } from "../../../application/use-cases/admin/ResolveChallengeUseCase";
import { PrismaUserRepository } from "../../database/prisma/PrismaUserRepository";

export class AdminController {
  private userRepository = new PrismaUserRepository();

  getAllUsers = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 20;

    const useCase = new GetAllUsersUseCase(this.userRepository);
    const result = await useCase.execute(page, pageSize);

    return res.json({
      success: true,
      data: result,
      message: "Usuarios listados correctamente",
    });
  };

  updateUserRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = req.body;

    if (!role) {
      return res.status(400).json({
        success: false,
        error: "El rol es requerido",
        statusCode: 400,
      });
    }

    const useCase = new UpdateUserRoleUseCase(this.userRepository);
    const result = await useCase.execute(id, role);

    return res.json({
      success: true,
      data: result,
      message: "Rol de usuario actualizado correctamente",
    });
  };

  getAllChallenges = async (req: Request, res: Response) => {
    const status = req.query.status ? (req.query.status as string) : undefined;
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 20;

    const useCase = new GetAllChallengesUseCase();
    const result = await useCase.execute(status, page, pageSize);

    return res.json({
      success: true,
      data: result,
      message: "Retos listados correctamente",
    });
  };

  resolveChallenge = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { action, winnerId } = req.body;

    if (!action) {
      return res.status(400).json({
        success: false,
        error: "La acción es requerida (set_winner, cancel, annul)",
        statusCode: 400,
      });
    }

    const useCase = new ResolveChallengeUseCase();
    const result = await useCase.execute({
      challengeId: id,
      action,
      winnerId,
    });

    return res.json({
      success: true,
      data: result,
      message: `Reto resuelto con acción: ${action}`,
    });
  };
}
