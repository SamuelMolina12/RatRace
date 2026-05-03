import { Router } from "express";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { RegisterUseCase } from "../../../application/use-cases/auth/RegisterUseCase";
import { PrismaUserRepository } from "../../database/prisma/PrismaUserRepository";
import { JwtService } from "../../security/JwtService";
import { PasswordService } from "../../security/PasswordService";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

const userRepository = new PrismaUserRepository();
const passwordService = new PasswordService();
const jwtService = new JwtService();

const registerUseCase = new RegisterUseCase(userRepository, passwordService);
const loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);

const authController = new AuthController(registerUseCase, loginUseCase);

router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.get("/me", authMiddleware, authController.me);

export default router;