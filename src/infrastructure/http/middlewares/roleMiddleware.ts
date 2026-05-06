import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../../shared/constants/role.constants";
import { AppError } from "../../../shared/errors/AppError";

type RequestWithUser = Request & {
  user?: {
    sub: string;
    email: string;
    role: UserRole;
  };
};

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Usuario no autenticado", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("No tienes permisos para acceder a este recurso", 403);
    }

    return next();
  };
}
