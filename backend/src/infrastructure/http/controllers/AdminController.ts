import { Request, Response } from "express";
import { GetAllAdminUsersUseCase } from "../../../application/use-cases/admin/GetAllAdminUsersUseCase";
import { GetUserByIdUseCase } from "../../../application/use-cases/admin/GetUserByIdUseCase";
import { SuspendUserUseCase } from "../../../application/use-cases/admin/SuspendUserUseCase";
import { ActivateUserUseCase } from "../../../application/use-cases/admin/ActivateUserUseCase";
import { GetAdminDashboardUseCase } from "../../../application/use-cases/admin/GetAdminDashboardUseCase";
import { UpdateUserRoleUseCase } from "../../../application/use-cases/admin/UpdateUserRoleUseCase";
import { GetAllChallengesUseCase } from "../../../application/use-cases/admin/GetAllChallengesUseCase";
import { ResolveChallengeUseCase } from "../../../application/use-cases/admin/ResolveChallengeUseCase";

export class AdminController {
  constructor(
    private getAllUsersUseCase: GetAllAdminUsersUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase,
    private suspendUserUseCase: SuspendUserUseCase,
    private activateUserUseCase: ActivateUserUseCase,
    private getAdminDashboardUseCase: GetAdminDashboardUseCase,
    private updateUserRoleUseCase: UpdateUserRoleUseCase,
    private getAllChallengesUseCase: GetAllChallengesUseCase,
    private resolveChallengeUseCase: ResolveChallengeUseCase,
  ) {}

  private getSingleParamId(id: string | string[]) {
    if (Array.isArray(id)) {
      return null;
    }

    return id;
  }

  getAllUsers = async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize as string)
      : 20;
    const search = req.query.search
      ? String(req.query.search).trim()
      : undefined;
    const estado = req.query.estado
      ? String(req.query.estado).trim()
      : undefined;
    const role = req.query.role ? String(req.query.role).trim() : undefined;

    const result = await this.getAllUsersUseCase.execute(page, pageSize, {
      search,
      estado,
      role,
    });

    return res.json({
      success: true,
      data: result,
      message: "Usuarios listados correctamente",
    });
  };

  getUserById = async (req: Request, res: Response) => {
    const id = this.getSingleParamId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "El id es requerido",
        statusCode: 400,
      });
    }

    const result = await this.getUserByIdUseCase.execute(id);

    return res.json({
      success: true,
      data: result,
      message: "Usuario obtenido correctamente",
    });
  };

  suspendUser = async (req: Request, res: Response) => {
    const id = this.getSingleParamId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "El id es requerido",
        statusCode: 400,
      });
    }

    const result = await this.suspendUserUseCase.execute(id);

    return res.json({
      success: true,
      data: result,
      message: "Usuario suspendido correctamente",
    });
  };

  activateUser = async (req: Request, res: Response) => {
    const id = this.getSingleParamId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "El id es requerido",
        statusCode: 400,
      });
    }

    const result = await this.activateUserUseCase.execute(id);

    return res.json({
      success: true,
      data: result,
      message: "Usuario activado correctamente",
    });
  };

  getDashboard = async (_req: Request, res: Response) => {
    const result = await this.getAdminDashboardUseCase.execute();

    return res.json({
      success: true,
      data: result,
      message: "Dashboard obtenido correctamente",
    });
  };

  updateUserRole = async (req: Request, res: Response) => {
    const id = this.getSingleParamId(req.params.id);
    const { role } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "El id es requerido",
        statusCode: 400,
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        error: "El rol es requerido",
        statusCode: 400,
      });
    }

    const result = await this.updateUserRoleUseCase.execute(id, role);

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

    const result = await this.getAllChallengesUseCase.execute(
      status,
      page,
      pageSize,
    );

    return res.json({
      success: true,
      data: result,
      message: "Retos listados correctamente",
    });
  };

  resolveChallenge = async (req: Request, res: Response) => {
    const id = this.getSingleParamId(req.params.id);
    const { action, winnerId } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        error: "El id es requerido",
        statusCode: 400,
      });
    }

    if (!action) {
      return res.status(400).json({
        success: false,
        error: "La acción es requerida (set_winner, cancel, annul)",
        statusCode: 400,
      });
    }

    const result = await this.resolveChallengeUseCase.execute({
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
