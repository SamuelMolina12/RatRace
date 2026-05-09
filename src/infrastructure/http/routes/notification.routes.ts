import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const notificationRoutes = Router();
const notificationController = new NotificationController();

/**
 * @swagger
 * /notifications/my:
 *   get:
 *     summary: Get authenticated user's notifications
 *     description: Returns notifications for the authenticated user. It can optionally return only unread notifications using the unreadOnly query parameter.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: unreadOnly
 *         required: false
 *         schema:
 *           type: boolean
 *           example: true
 *         description: If true, returns only unread notifications.
 *     responses:
 *       200:
 *         description: Notifications returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationsListResponse'
 *             examples:
 *               allNotifications:
 *                 summary: All notifications
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "96ae8d73-5464-469a-a503-1d0913ae388a"
 *                       userId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       type: "challenge_completed"
 *                       message: "Ya se registró el resultado del reto"
 *                       read: false
 *                       referenceId: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                       createdAt: "2026-05-08T23:33:39.117Z"
 *                     - id: "4cdbea2-2746-4f5a-8940-6676158d5e29"
 *                       userId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       type: "challenge_started"
 *                       message: "El reto está en curso"
 *                       read: false
 *                       referenceId: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                       createdAt: "2026-05-08T23:30:58.240Z"
 *                     - id: "c91b22e7-0e70-4415-a3cf-72619eeda255"
 *                       userId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       type: "challenge_received"
 *                       message: "Has recibido un nuevo reto"
 *                       read: false
 *                       referenceId: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                       createdAt: "2026-05-08T23:23:34.827Z"
 *                   message: "Notificaciones encontradas"
 *               unreadOnly:
 *                 summary: Unread notifications only
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "96ae8d73-5464-469a-a503-1d0913ae388a"
 *                       userId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       type: "challenge_completed"
 *                       message: "Ya se registró el resultado del reto"
 *                       read: false
 *                       referenceId: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                       createdAt: "2026-05-08T23:33:39.117Z"
 *                   message: "Notificaciones encontradas"
 *               emptyNotifications:
 *                 summary: Empty notifications list
 *                 value:
 *                   success: true
 *                   data: []
 *                   message: "Notificaciones encontradas"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
notificationRoutes.get("/my", authMiddleware, (req, res) =>
  notificationController.findMyNotifications(req, res),
);

/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark notification as read
 *     description: Marks a notification as read for the authenticated user.
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           example: "4cdbea2-2746-4f5a-8940-6676158d5e29"
 *         description: Notification ID.
 *     responses:
 *       200:
 *         description: Notification marked as read successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotificationResponse'
 *             example:
 *               success: true
 *               data:
 *                 id: "4cdbea2-2746-4f5a-8940-6676158d5e29"
 *                 userId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                 type: "challenge_started"
 *                 message: "El reto está en curso"
 *                 read: true
 *                 referenceId: "8061ee9d-0247-4b67-a052-56e3a20b5e49"
 *                 createdAt: "2026-05-08T23:30:58.240Z"
 *               message: "Notificación marcada como leída"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Notification not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Notificación no encontrada"
 *               statusCode: 404
 */
notificationRoutes.patch("/:id/read", authMiddleware, (req, res) =>
  notificationController.markAsRead(req, res),
);

export default notificationRoutes;
