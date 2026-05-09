import { Router } from "express";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase";
import { RegisterUseCase } from "../../../application/use-cases/auth/RegisterUseCase";
import { PrismaUserRepository } from "../../database/prisma/PrismaUserRepository";
import { JwtService } from "../../security/JwtService";
import { PasswordService } from "../../security/PasswordService";
import { AuthController } from "../controllers/AuthController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import { registerSchema,loginSchema } from "../validators/auth.validators";

const router = Router();

const userRepository = new PrismaUserRepository();
const passwordService = new PasswordService();
const jwtService = new JwtService();

const registerUseCase = new RegisterUseCase(userRepository, passwordService);
const loginUseCase = new LoginUseCase(userRepository, passwordService, jwtService);

const authController = new AuthController(registerUseCase, loginUseCase);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new pilot user account in the platform.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             username: pablo
 *             email: pablo@gmail.com
 *             password: pablo23
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 id: "47afb628-1e6e-49c5-bd0f-131dd97b1c5f"
 *                 username: "pablo"
 *                 email: "pablo@gmail.com"
 *               message: "Usuario registrado exitosamente"
 *       400:
 *         description: Validation error, duplicated email or duplicated username
 *         content:
 *           application/json:
 *             examples:
 *               duplicatedEmail:
 *                 summary: Email already registered
 *                 value:
 *                   success: false
 *                   error: "El email ya está registrado"
 *                   statusCode: 400
 *               duplicatedUsername:
 *                 summary: Username already registered
 *                 value:
 *                   success: false
 *                   error: "El username ya está registrado"
 *                   statusCode: 400
 *               invalidEmail:
 *                 summary: Invalid email
 *                 value:
 *                   success: false
 *                   error: "Email inválido"
 *                   statusCode: 400
 *               invalidEmailAndPassword:
 *                 summary: Invalid email and short password
 *                 value:
 *                   success: false
 *                   error: "Email inválido, La contraseña debe tener mínimo 6 caracteres"
 *                   statusCode: 400
 */
router.post( "/register",validateRequest(registerSchema),(req, res) => authController.register(req, res));

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             email: pablo@gmail.com
 *             password: pablo23
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 token: "jwt_token_here"
 *                 user:
 *                   id: "47afb628-1e6e-49c5-bd0f-131dd97b1c5f"
 *                   username: "pablo"
 *                   email: "pablo@gmail.com"
 *                   role: "PILOT"
 *               message: "Login exitoso"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             examples:
 *               invalidEmail:
 *                 summary: Invalid email
 *                 value:
 *                   success: false
 *                   error: "Email inválido"
 *                   statusCode: 400
 *               emptyPassword:
 *                 summary: Empty password
 *                 value:
 *                   success: false
 *                   error: "La contraseña es obligatoria"
 *                   statusCode: 400
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Credenciales invalidas"
 *               statusCode: 401
 */

router.post("/login", validateRequest(loginSchema), (req, res) => authController.login(req, res));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get authenticated user
 *     description: Returns the authenticated user payload from the JWT token.
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user returned successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               data:
 *                 sub: "47afb628-1e6e-49c5-bd0f-131dd97b1c5f"
 *                 email: "pablo@gmail.com"
 *                 role: "PILOT"
 *                 iat: 1778270344
 *                 exp: 1778356744
 *               message: "Usuario autenticado"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me", authMiddleware, authController.me);

export default router;