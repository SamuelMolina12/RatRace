import { Router } from "express";
import { ChallengeController } from "../controllers/ChallengeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const challengeRoutes = Router();
const challengeController = new ChallengeController();

/**
 * @swagger
 * /challenges:
 *   post:
 *     summary: Create challenge
 *     description: Creates a new challenge against another pilot. The authenticated user is the challenger.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateChallengeRequest'
 *           example:
 *             challengedId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *             raceType: "quarter_mile"
 *             agreedLocation: "Autopista Norte"
 *             agreedDate: "2026-05-10T22:00:00.000Z"
 *             notes: "Reto amistoso"
 *     responses:
 *       201:
 *         description: Challenge created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengeResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                 challengerId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                 challengedId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                 raceType: "quarter_mile"
 *                 challengerVehicleId: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                 challengedVehicleId: "61a80583-1840-46e0-851b-1878b5d416a2"
 *                 status: "pending"
 *                 winnerId: null
 *                 agreedLocation: "Autopista Norte"
 *                 agreedDate: "2026-05-10T22:00:00.000Z"
 *                 notes: "Reto amistoso"
 *                 createdAt: "2026-05-08T23:23:34.797Z"
 *                 updatedAt: "2026-05-08T23:23:34.797Z"
 *               message: "Reto creado correctamente"
 *       400:
 *         description: Business rule error
 *         content:
 *           application/json:
 *             examples:
 *               challengedWithoutActiveVehicle:
 *                 summary: Challenged pilot has no active vehicle
 *                 value:
 *                   success: false
 *                   error: "El piloto retado no tiene vehículo activo"
 *                   statusCode: 400
 *               differentVehicleType:
 *                 summary: Different active vehicle type
 *                 value:
 *                   success: false
 *                   error: "Solo puedes retar pilotos con el mismo tipo de vehículo activo"
 *                   statusCode: 400
 *               selfChallenge:
 *                 summary: User cannot challenge himself
 *                 value:
 *                   success: false
 *                   error: "No puedes retarte a ti mismo"
 *                   statusCode: 400
 *               activeChallengeExists:
 *                 summary: Active challenge already exists
 *                 value:
 *                   success: false
 *                   error: "Ya existe un reto activo con este piloto"
 *                   statusCode: 400
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Challenged pilot not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Piloto retado no encontrado"
 *               statusCode: 404
 */
challengeRoutes.post("/", authMiddleware, (req, res) =>
  challengeController.create(req, res),
);

/**
 * @swagger
 * /challenges/my:
 *   get:
 *     summary: Get authenticated user's challenges
 *     description: Returns challenges where the authenticated user is either challenger or challenged. It can be filtered by challenge status.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         required: false
 *         schema:
 *           type: string
 *           enum: [pending, accepted, rejected, in_progress, completed, canceled]
 *           example: completed
 *         description: Optional challenge status filter.
 *     responses:
 *       200:
 *         description: User challenges returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengesListResponse'
 *             examples:
 *               withStatusFilter:
 *                 summary: Filtered by completed status
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                       challengerId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                       challengerName: "sam"
 *                       challengedId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       challengedName: "juan"
 *                       raceType: "quarter_mile"
 *                       challengerVehicleId: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                       challengerVehicleName: "Kawasaki Ninja 400"
 *                       challengedVehicleId: "61a80583-1840-46e0-851b-1878b5d416a2"
 *                       challengedVehicleName: "Suzuki GSX250R"
 *                       status: "completed"
 *                       winnerId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       agreedLocation: "Autopista Norte"
 *                       agreedDate: "2026-05-10T22:00:00.000Z"
 *                       notes: "Reto amistoso"
 *                       createdAt: "2026-05-08T23:23:34.797Z"
 *                       updatedAt: "2026-05-08T23:33:38.997Z"
 *                   message: "Retos del usuario encontrados"
 *               emptyList:
 *                 summary: User without challenges for selected filter
 *                 value:
 *                   success: true
 *                   data: []
 *                   message: "Retos del usuario encontrados"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
challengeRoutes.get("/my", authMiddleware, (req, res) =>
  challengeController.findMyChallenges(req, res),
);

/**
 * @swagger
 * /challenges/user/{userId}:
 *   get:
 *     summary: Get challenges by user ID
 *     description: Returns challenges for a specific user. This is useful to view another user's challenge history.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           example: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *         description: User ID.
 *     responses:
 *       200:
 *         description: User challenges returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengesListResponse'
 *             examples:
 *               withChallenges:
 *                 summary: User with challenges
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                       challengerId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                       challengerName: "sam"
 *                       challengedId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       challengedName: "juan"
 *                       raceType: "quarter_mile"
 *                       challengerVehicleId: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                       challengerVehicleName: "Kawasaki Ninja 400"
 *                       challengedVehicleId: "61a80583-1840-46e0-851b-1878b5d416a2"
 *                       challengedVehicleName: "Suzuki GSX250R"
 *                       status: "completed"
 *                       winnerId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       agreedLocation: "Autopista Norte"
 *                       agreedDate: "2026-05-10T22:00:00.000Z"
 *                       notes: "Reto amistoso"
 *                       createdAt: "2026-05-08T23:23:34.797Z"
 *                       updatedAt: "2026-05-08T23:33:38.997Z"
 *                   message: "Retos del usuario encontrados"
 *               emptyChallenges:
 *                 summary: User without challenges
 *                 value:
 *                   success: true
 *                   data: []
 *                   message: "Retos del usuario encontrados"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
challengeRoutes.get("/user/:userId", authMiddleware, (req, res) =>
  challengeController.findUserChallenges(req, res),
);

/**
 * @swagger
 * /challenges/{id}:
 *   get:
 *     summary: Get challenge by ID
 *     description: Returns a challenge by its ID with challenger, challenged and vehicle information.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *         description: Challenge ID.
 *     responses:
 *       200:
 *         description: Challenge returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengeDetailResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                 challengerId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                 challengerName: "sam"
 *                 challengedId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                 challengedName: "juan"
 *                 raceType: "quarter_mile"
 *                 challengerVehicleId: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                 challengerVehicleName: "Kawasaki Ninja 400"
 *                 challengedVehicleId: "61a80583-1840-46e0-851b-1878b5d416a2"
 *                 challengedVehicleName: "Suzuki GSX250R"
 *                 status: "completed"
 *                 winnerId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                 agreedLocation: "Autopista Norte"
 *                 agreedDate: "2026-05-10T22:00:00.000Z"
 *                 notes: "Reto amistoso"
 *                 createdAt: "2026-05-08T23:23:34.797Z"
 *                 updatedAt: "2026-05-08T23:33:38.997Z"
 *               message: "Reto encontrado"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Reto no encontrado"
 *               statusCode: 404
 */
challengeRoutes.get("/:id", authMiddleware, (req, res) =>
  challengeController.findById(req, res),
);

/**
 * @swagger
 * /challenges/{id}/accept:
 *   patch:
 *     summary: Accept challenge
 *     description: Accepts a pending challenge. Only the challenged pilot can accept it.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *         description: Challenge ID.
 *     responses:
 *       200:
 *         description: Challenge accepted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengeResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                 challengerId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                 challengedId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                 raceType: "quarter_mile"
 *                 challengerVehicleId: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                 challengedVehicleId: "61a80583-1840-46e0-851b-1878b5d416a2"
 *                 status: "accepted"
 *                 winnerId: null
 *                 agreedLocation: "Autopista Norte"
 *                 agreedDate: "2026-05-10T22:00:00.000Z"
 *                 notes: "Reto amistoso"
 *               message: "Reto aceptado correctamente"
 *       400:
 *         description: Invalid challenge status
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Solo se pueden aceptar retos pendientes"
 *               statusCode: 400
 *       403:
 *         description: User is not allowed to accept this challenge
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Solo el piloto retado puede aceptar este reto"
 *               statusCode: 403
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Reto no encontrado"
 *               statusCode: 404
 */
challengeRoutes.patch("/:id/accept", authMiddleware, (req, res) =>
  challengeController.accept(req, res),
);

/**
 * @swagger
 * /challenges/{id}/reject:
 *   patch:
 *     summary: Reject challenge
 *     description: Rejects a pending challenge. Only the challenged pilot can reject it.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *         description: Challenge ID.
 *     responses:
 *       200:
 *         description: Challenge rejected successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengeResponse'
 *       400:
 *         description: Invalid challenge status
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Solo se pueden rechazar retos pendientes"
 *               statusCode: 400
 *       403:
 *         description: User is not allowed to reject this challenge
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Solo el piloto retado puede rechazar este reto"
 *               statusCode: 403
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Reto no encontrado"
 *               statusCode: 404
 */
challengeRoutes.patch("/:id/reject", authMiddleware, (req, res) =>
  challengeController.reject(req, res),
);

/**
 * @swagger
 * /challenges/{id}/cancel:
 *   patch:
 *     summary: Cancel challenge
 *     description: Cancels a challenge according to the business rules.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *         description: Challenge ID.
 *     responses:
 *       200:
 *         description: Challenge canceled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengeResponse'
 *       400:
 *         description: Invalid challenge status
 *       403:
 *         description: User is not allowed to cancel this challenge
 *       404:
 *         description: Challenge not found
 */
challengeRoutes.patch("/:id/cancel", authMiddleware, (req, res) =>
  challengeController.cancel(req, res),
);

/**
 * @swagger
 * /challenges/{id}/start:
 *   patch:
 *     summary: Start challenge
 *     description: Starts an accepted challenge.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *         description: Challenge ID.
 *     responses:
 *       200:
 *         description: Challenge started successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChallengeResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                 challengerId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                 challengedId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                 raceType: "quarter_mile"
 *                 challengerVehicleId: "b4559545-9907-4d3f-99f5-8d089b2749e9"
 *                 challengedVehicleId: "61a80583-1840-46e0-851b-1878b5d416a2"
 *                 status: "in_progress"
 *                 winnerId: null
 *                 agreedLocation: "Autopista Norte"
 *                 agreedDate: "2026-05-10T22:00:00.000Z"
 *                 notes: "Reto amistoso"
 *               message: "Reto iniciado correctamente"
 *       400:
 *         description: Invalid challenge status
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Solo se pueden iniciar retos aceptados"
 *               statusCode: 400
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Reto no encontrado"
 *               statusCode: 404
 */
challengeRoutes.patch("/:id/start", authMiddleware, (req, res) =>
  challengeController.start(req, res),
);

/**
 * @swagger
 * /challenges/{id}/complete:
 *   patch:
 *     summary: Complete challenge
 *     description: Completes an in-progress challenge, sets the winner and updates ranking statistics.
 *     tags:
 *       - Challenges
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *         description: Challenge ID.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CompleteChallengeRequest'
 *           example:
 *             winnerId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *     responses:
 *       200:
 *         description: Challenge completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CompleteChallengeResponse'
 *       400:
 *         description: Invalid winner or invalid challenge status
 *         content:
 *           application/json:
 *             examples:
 *               invalidWinner:
 *                 summary: Winner is not a challenge participant
 *                 value:
 *                   success: false
 *                   error: "El ganador debe ser uno de los pilotos del reto"
 *                   statusCode: 400
 *               invalidStatus:
 *                 summary: Challenge is not in progress
 *                 value:
 *                   success: false
 *                   error: "Solo se pueden completar retos en progreso"
 *                   statusCode: 400
 *       404:
 *         description: Challenge not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Reto no encontrado"
 *               statusCode: 404
 */
challengeRoutes.patch("/:id/complete", authMiddleware, (req, res) =>
  challengeController.complete(req, res),
);

export default challengeRoutes;
