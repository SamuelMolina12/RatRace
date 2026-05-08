import { Router } from "express";
import { ChatController } from "../controllers/ChatController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();
const chatController = new ChatController();

router.get("/conversations", authMiddleware, chatController.getUserConversations);
router.get("/messages/:conversationId", authMiddleware, chatController.getMessagesByConversation);
export default router;