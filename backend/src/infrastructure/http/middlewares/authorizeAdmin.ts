import { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/AppError";
import { ROLES } from "../../../shared/constants/role.constants";

type RequestWithUser = Request & {
  user?: {
    sub: string;
    email: string;
    role: string;
  };
};

export function authorizeAdmin(
  req: RequestWithUser,
  _res: Response,
  next: NextFunction,
) {
  if (!req.user) {
    throw new AppError("Usuario no autenticado", 401);
  }

  if (req.user.role !== ROLES.ADMIN) {
    throw new AppError("No tienes permisos para acceder a este recurso", 403);
  }

  return next();
}
