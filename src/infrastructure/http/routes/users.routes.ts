import { Router } from "express";
import { GetUserProfileUseCase } from "../../../application/use-cases/users/GetUserProfileUseCase";
import { UpdateMyProfileUseCase } from "../../../application/use-cases/users/UpdateMyProfileUseCase";
import { DiscoverPilotsUseCase } from "../../../application/use-cases/users/DiscoverPilotsUseCase";
import { PrismaUserRepository } from "../../database/prisma/PrismaUserRepository";
import { UsersController } from "../controllers/UsersController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

const userRepository = new PrismaUserRepository();

const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateMyProfileUseCase = new UpdateMyProfileUseCase(userRepository);
const discoverPilotsUseCase = new DiscoverPilotsUseCase(userRepository);

const usersController = new UsersController(
  getUserProfileUseCase,
  updateMyProfileUseCase,
  discoverPilotsUseCase
);

/**
 * @swagger
 * /users/me:
 *   get:
 *     summary: Get authenticated user profile
 *     description: Returns the profile information of the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "47afb628-1e6e-49c5-bd0f-131dd97b1c5f"
 *                 username: "pablo"
 *                 email: "pablo@gmail.com"
 *                 role: "PILOT"
 *                 rank: "D"
 *                 wins: 0
 *                 losses: 0
 *                 profilePhoto: "https://images/pablo.jpg"
 *                 locality: "Calatrava"
 *                 city: "Medellin"
 *                 state: "Antioquia"
 *                 country: "Colombia"
 *               message: "Perfil obtenido correctamente"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/me", authMiddleware, usersController.getMe);

/**
 * @swagger
 * /users/me:
 *   put:
 *     summary: Update authenticated user profile
 *     description: Updates editable profile fields for the authenticated user.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProfileRequest'
 *           example:
 *             username: "valentinoRossiElite"
 *             profilePhoto: "https://images/rossi_new.jpg"
 *             locality: "Laureles"
 *             city: "Medellin"
 *             state: "Antioquia"
 *             country: "Colombia"
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "47afb628-1e6e-49c5-bd0f-131dd97b1c5f"
 *                 username: "valentinoRossiElite"
 *                 email: "pablo@gmail.com"
 *                 role: "PILOT"
 *                 rank: "D"
 *                 wins: 0
 *                 losses: 0
 *                 profilePhoto: "https://images/rossi_new.jpg"
 *                 locality: "Laureles"
 *                 city: "Medellin"
 *                 state: "Antioquia"
 *                 country: "Colombia"
 *               message: "Perfil actualizado correctamente"
 *       400:
 *         description: Invalid profile data
 *         content:
 *           application/json:
 *             examples:
 *               invalidUsername:
 *                 summary: Invalid username
 *                 value:
 *                   success: false
 *                   error: "El username debe tener mínimo 3 caracteres"
 *                   statusCode: 400
 *               invalidProfilePhoto:
 *                 summary: Invalid profile photo URL
 *                 value:
 *                   success: false
 *                   error: "La foto de perfil debe ser una URL válida"
 *                   statusCode: 400
 *               forbiddenField:
 *                 summary: Field not allowed
 *                 value:
 *                   success: false
 *                   error: "Hay campos no permitidos para actualizar el perfil"
 *                   statusCode: 400
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/me", authMiddleware, usersController.updateMe);

/**
 * @swagger
 * /users/discover:
 *   get:
 *     summary: Discover available pilots
 *     description: Returns pilots with the same rank and same active vehicle type as the authenticated user. Optional filters can be sent as query parameters.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Page number for pagination.
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: locality
 *         required: false
 *         schema:
 *           type: string
 *           example: Calatrava
 *         description: Filter pilots by locality.
 *       - in: query
 *         name: city
 *         required: false
 *         schema:
 *           type: string
 *           example: Itagui
 *         description: Filter pilots by city.
 *       - in: query
 *         name: state
 *         required: false
 *         schema:
 *           type: string
 *           example: Antioquia
 *         description: Filter pilots by state or department.
 *       - in: query
 *         name: country
 *         required: false
 *         schema:
 *           type: string
 *           example: Colombia
 *         description: Filter pilots by country.
 *     responses:
 *       200:
 *         description: Available pilots returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DiscoverPilotsResponse'
 *             example:
 *               success: true
 *               data:
 *                 items:
 *                   - id: "09dc5f09-5597-4ac6-8640-80fdd54b6bef"
 *                     username: "juan"
 *                     profilePhoto: "https://images/juan.jpg"
 *                     locality: "Calatrava"
 *                     city: "Itagui"
 *                     state: "Antioquia"
 *                     country: "Colombia"
 *                     rank: "D"
 *                     wins: 1
 *                     losses: 2
 *                     consecutiveWins: 1
 *                     vehicles:
 *                       - id: "56d7e17-fd64-453f-a8a3-c00566488bff"
 *                         vehicleType: "motorcycle"
 *                         brand: "Yamaha"
 *                         model: "YZF-R3"
 *                         year: 2022
 *                         color: "Blue"
 *                         photo: "https://images/yamaha_yzf-r3.jpg"
 *                         active: true
 *                 pagination:
 *                   page: 1
 *                   limit: 10
 *                   total: 1
 *                   totalPages: 1
 *               message: "Pilotos disponibles consultados correctamente"
 *       400:
 *         description: Authenticated user does not have an active vehicle
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Debes tener un vehículo activo para descubrir pilotos"
 *               statusCode: 400
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/discover", authMiddleware, usersController.discoverPilots);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get user public profile by ID
 *     description: Returns the public profile information of a user by ID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "07c02bc0-c4f5-405b-8dc6-4a43f08e1c77"
 *         description: User ID.
 *     responses:
 *       200:
 *         description: User returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "07c02bc0-c4f5-405b-8dc6-4a43f08e1c77"
 *                 username: "sam"
 *                 email: "sam@gmail.com"
 *                 role: "PILOT"
 *                 rank: "D"
 *                 wins: 0
 *                 losses: 1
 *                 profilePhoto: "https://images/sam.jpg"
 *                 locality: "Calatrava"
 *                 city: "Itagui"
 *                 state: "Antioquia"
 *                 country: "Colombia"
 *               message: "Usuario obtenido correctamente"
 *       400:
 *         description: Invalid ID
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "ID inválido"
 *               statusCode: 400
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Usuario no encontrado"
 *               statusCode: 404
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", authMiddleware, usersController.getById);

export default router;