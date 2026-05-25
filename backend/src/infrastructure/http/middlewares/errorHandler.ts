import { Request, Response, NextFunction } from "express";
import { AppError } from "../../../shared/errors/AppError";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      statusCode: err.statusCode
    });
  }

  console.error(err);

  return res.status(500).json({
    success: false,
    error: "Error interno del servidor",
    statusCode: 500
  });
}