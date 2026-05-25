import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../../config/env";
import { AppError } from "../../../shared/errors/AppError";

interface TokenPayload {
  sub: string;
  email: string;
  role: string;
}

export function authMiddleware(
  req: Request & { user?: TokenPayload },
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token no proporcionado", 401);
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as TokenPayload;

    req.user = decoded;

    return next();
  } catch (error) {
    throw new AppError("Token inválido", 401);
  }
}