import { Router } from "express";
import { CreateVehicleUseCase } from "../../../application/use-cases/vehicles/CreateVehicleUseCase";
import { DeleteVehicleUseCase } from "../../../application/use-cases/vehicles/DeleteVehicleUseCase";
import { GetMyVehiclesUseCase } from "../../../application/use-cases/vehicles/GetMyVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../../../application/use-cases/vehicles/GetVehicleByIdUseCase";
import { SetActiveVehicleUseCase } from "../../../application/use-cases/vehicles/SetActiveVehicleUseCase";
import { UpdateVehicleUseCase } from "../../../application/use-cases/vehicles/UpdateVehicleUseCase";
import { PrismaVehicleRepository } from "../../database/prisma/PrismaVehicleRepository";
import { VehiclesController } from "../controllers/VehiclesController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

const vehicleRepository = new PrismaVehicleRepository();

const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
const getMyVehiclesUseCase = new GetMyVehiclesUseCase(vehicleRepository);
const getVehicleByIdUseCase = new GetVehicleByIdUseCase(vehicleRepository);
const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository);
const deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);
const setActiveVehicleUseCase = new SetActiveVehicleUseCase(vehicleRepository);

const vehiclesController = new VehiclesController(
  createVehicleUseCase,
  getMyVehiclesUseCase,
  getVehicleByIdUseCase,
  updateVehicleUseCase,
  deleteVehicleUseCase,
  setActiveVehicleUseCase,
);

/**
 * @swagger
 * /vehicles:
 *   get:
 *     summary: Get authenticated user's vehicles
 *     description: Returns all vehicles registered by the authenticated user.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vehicles returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehiclesListResponse'
 *             examples:
 *               withVehicles:
 *                 summary: User with vehicles
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                       userId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                       vehicleType: "motorcycle"
 *                       brand: "Yamaha"
 *                       model: "YZF-R3"
 *                       year: 2022
 *                       color: "Blue"
 *                       plate: "MOTO300"
 *                       photo: "https://images/yamaha_yzfr3.jpg"
 *                       modifications: "Escape deportivo y llantas de alto agarre"
 *                       active: true
 *                       createdAt: "2026-05-08T22:52:10.423Z"
 *                       updatedAt: "2026-05-08T22:52:10.423Z"
 *                   message: "Vehículos obtenidos correctamente"
 *               emptyVehicles:
 *                 summary: User without vehicles
 *                 value:
 *                   success: true
 *                   data: []
 *                   message: "Vehículos obtenidos correctamente"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Token inválido"
 *               statusCode: 401
 */
router.get("/", authMiddleware, vehiclesController.getMyVehicles);

/**
 * @swagger
 * /vehicles/{id}:
 *   get:
 *     summary: Get vehicle by ID
 *     description: Returns a vehicle by its ID if it belongs to the authenticated user.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *         description: Vehicle ID.
 *     responses:
 *       200:
 *         description: Vehicle returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                 userId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                 vehicleType: "motorcycle"
 *                 brand: "Yamaha"
 *                 model: "YZF-R3"
 *                 year: 2022
 *                 color: "Blue"
 *                 plate: "MOTO300"
 *                 photo: "https://images/yamaha_yzfr3.jpg"
 *                 modifications: "Escape deportivo y llantas de alto agarre"
 *                 active: true
 *                 createdAt: "2026-05-08T22:52:10.423Z"
 *                 updatedAt: "2026-05-08T22:52:10.423Z"
 *               message: "Vehículo obtenido correctamente"
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: User does not own the vehicle
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No tienes permisos para consultar este vehículo"
 *               statusCode: 403
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Vehículo no encontrado"
 *               statusCode: 404
 */
router.get("/:id", authMiddleware, vehiclesController.getById);

/**
 * @swagger
 * /vehicles:
 *   post:
 *     summary: Create vehicle
 *     description: Registers a new vehicle for the authenticated user.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateVehicleRequest'
 *           example:
 *             vehicleType: "motorcycle"
 *             brand: "Kawasaki"
 *             model: "Ninja 400"
 *             year: 2021
 *             color: "Green"
 *             plate: "MOTO400"
 *             photo: "https://images/kawasaki_ninja400.jpg"
 *             modifications: "Escape Akrapovic y suspensión ajustada"
 *             active: true
 *     responses:
 *       201:
 *         description: Vehicle created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "8a51f5b3-653e-44e4-821b-ec0b18a6d4b0"
 *                 userId: "08244d4b-4b68-4774-a109-bf13e91b2925"
 *                 vehicleType: "motorcycle"
 *                 brand: "Kawasaki"
 *                 model: "Ninja 400"
 *                 year: 2021
 *                 color: "Green"
 *                 plate: "MOTO400"
 *                 photo: "https://images/kawasaki_ninja400.jpg"
 *                 modifications: "Escape Akrapovic y suspensión ajustada"
 *                 active: true
 *                 createdAt: "2026-05-08T22:53:31.576Z"
 *                 updatedAt: "2026-05-08T22:53:31.576Z"
 *               message: "Vehículo registrado correctamente"
 *       400:
 *         description: Invalid data or business rule error
 *         content:
 *           application/json:
 *             examples:
 *               maxVehicles:
 *                 summary: Maximum vehicles reached
 *                 value:
 *                   success: false
 *                   error: "No puedes registrar más de 3 vehículos"
 *                   statusCode: 400
 *               duplicatedPlate:
 *                 summary: Plate already registered
 *                 value:
 *                   success: false
 *                   error: "La placa ya está registrada"
 *                   statusCode: 400
 *       401:
 *         description: Missing or invalid token
 */
router.post("/", authMiddleware, vehiclesController.create);

/**
 * @swagger
 * /vehicles/{id}:
 *   put:
 *     summary: Update vehicle
 *     description: Updates a vehicle owned by the authenticated user.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *         description: Vehicle ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateVehicleRequest'
 *           example:
 *             vehicleType: "motorcycle"
 *             brand: "Kawasaki"
 *             model: "Ninja 400"
 *             year: 2021
 *             color: "Green"
 *             plate: "MOTO300"
 *             photo: "https://images/kawasaki_ninja400.jpg"
 *             modifications: "Escape Akrapovic y suspensión ajustada"
 *     responses:
 *       200:
 *         description: Vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                 userId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                 vehicleType: "motorcycle"
 *                 brand: "Kawasaki"
 *                 model: "Ninja 400"
 *                 year: 2021
 *                 color: "Green"
 *                 plate: "MOTO300"
 *                 photo: "https://images/kawasaki_ninja400.jpg"
 *                 modifications: "Escape Akrapovic y suspensión ajustada"
 *                 active: true
 *                 createdAt: "2026-05-08T22:52:10.423Z"
 *                 updatedAt: "2026-05-08T23:06:17.105Z"
 *               message: "Vehículo actualizado correctamente"
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: User does not own the vehicle
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No tienes permisos para actualizar este vehículo"
 *               statusCode: 403
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Vehículo no encontrado"
 *               statusCode: 404
 */
router.put("/:id", authMiddleware, vehiclesController.update);

/**
 * @swagger
 * /vehicles/{id}:
 *   delete:
 *     summary: Delete vehicle
 *     description: Deletes a vehicle owned by the authenticated user.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *         description: Vehicle ID.
 *     responses:
 *       200:
 *         description: Vehicle deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteVehicleResponse'
 *             example:
 *               success: true
 *               data: null
 *               message: "Vehículo eliminado correctamente"
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: User does not own the vehicle
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No tienes permisos para eliminar este vehículo"
 *               statusCode: 403
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Vehículo no encontrado"
 *               statusCode: 404
 */
router.delete("/:id", authMiddleware, vehiclesController.delete);

/**
 * @swagger
 * /vehicles/{id}/active:
 *   patch:
 *     summary: Set active vehicle
 *     description: Marks a vehicle as active for the authenticated user. Only one vehicle can be active at a time.
 *     tags:
 *       - Vehicles
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *         description: Vehicle ID.
 *     responses:
 *       200:
 *         description: Active vehicle updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VehicleResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                 userId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                 vehicleType: "motorcycle"
 *                 brand: "Yamaha"
 *                 model: "YZF-R3"
 *                 year: 2022
 *                 color: "Blue"
 *                 plate: "MOTO300"
 *                 photo: "https://images/yamaha_yzfr3.jpg"
 *                 modifications: "Escape deportivo y llantas de alto agarre"
 *                 active: true
 *                 createdAt: "2026-05-08T22:52:10.423Z"
 *                 updatedAt: "2026-05-08T23:01:37.625Z"
 *               message: "Vehículo activo actualizado correctamente"
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: User does not own the vehicle
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No tienes permisos para activar este vehículo"
 *               statusCode: 403
 *       404:
 *         description: Vehicle not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Vehículo no encontrado"
 *               statusCode: 404
 */
router.patch("/:id/active", authMiddleware, vehiclesController.setActive);

export default router;
