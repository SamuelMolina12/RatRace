import { Request, Response } from "express";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { RegisterUseCase } from "../../../application/use-cases/auth/RegisterUseCase";

export class AuthController {
  constructor(
    private registerUseCase: RegisterUseCase,
    private loginUseCase: LoginUseCase
  ) {}

  async register(req: Request, res: Response) {
    try {
      const user = await this.registerUseCase.execute(req.body);

      return res.status(201).json({
        success: true,
        data: user,
        message: "USuario registrado exitosamente"
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : "Error inexpernado",
        statusCode: 400
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const result = await this.loginUseCase.execute(req.body);

      return res.status(200).json({
        success: true,
        data: result,
        message: "Login exitoso"
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : "Error inexperado",
        statusCode: 401
      });
    }
  }

  me = async (req: any, res: any) => {
  return res.json({
    success: true,
    data: req.user,
    message: "Usuario autenticado"
  });
};
}