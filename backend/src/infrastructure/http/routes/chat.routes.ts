import { Router } from "express";
import { ChatController } from "../controllers/ChatController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const chatController = new ChatController();

/**
 * @swagger
 * /chat/conversations:
 *   get:
 *     summary: Get authenticated user's conversations
 *     description: Returns all chat conversations for the authenticated user. The user is obtained from the JWT token.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatConversationResponse'
 *             examples:
 *               withConversations:
 *                 summary: User with conversations
 *                 value:
 *                   success: true
 *                   data:
 *                     - id: "69fe78b8ac375e9c5e0b5762"
 *                       participants:
 *                         - "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                         - "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                       lastMessage: "hola"
 *                       lastMessageAt: "2026-05-08T23:58:48.280Z"
 *                       createdAt: "2026-05-08T23:58:48.252Z"
 *                       updatedAt: "2026-05-08T23:58:48.281Z"
 *                   message: "Conversaciones obtenidas correctamente"
 *               emptyConversations:
 *                 summary: User without conversations
 *                 value:
 *                   success: true
 *                   data: []
 *                   message: "Conversaciones obtenidas correctamente"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Token inválido"
 *               statusCode: 401
 */
router.get(
  "/conversations",
  authMiddleware,
  chatController.getUserConversations,
);

/**
 * @swagger
 * /chat/messages/{conversationId}:
 *   get:
 *     summary: Get messages by conversation ID
 *     description: Returns all messages for a specific conversation. The authenticated user must belong to the conversation.
 *     tags:
 *       - Chat
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *           example: "69fe78b8ac375e9c5e0b5762"
 *         description: Conversation ID.
 *     responses:
 *       200:
 *         description: Messages returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ChatMessagesResponse'
 *             example:
 *               success: true
 *               data:
 *                 - id: "69fe78b8ac375e9c5e0b5763"
 *                   conversationId: "69fe78b8ac375e9c5e0b5762"
 *                   senderId: "2cce91b9-9b69-477d-976e-f31358c88dc9"
 *                   receiverId: "f75d79b5-41e0-41b2-a13a-68ec8a37ea3e"
 *                   content: "hola"
 *                   read: false
 *                   createdAt: "2026-05-08T23:58:48.270Z"
 *                   updatedAt: "2026-05-08T23:58:48.270Z"
 *               message: "Mensajes consultados correctamente"
 *       401:
 *         description: Missing or invalid token
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Token inválido"
 *               statusCode: 401
 *       403:
 *         description: User does not belong to the conversation
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "No tienes permiso para ver esta conversación"
 *               statusCode: 403
 *       404:
 *         description: Conversation not found
 *         content:
 *           application/json:
 *             example:
 *               success: false
 *               error: "Conversación no encontrada"
 *               statusCode: 404
 */
router.get(
  "/messages/:conversationId",
  authMiddleware,
  chatController.getMessagesByConversation,
);

export default router;
