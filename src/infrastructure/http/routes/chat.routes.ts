import { Router } from "express";
import { ChatController } from "../controllers/ChatController";

const router = Router();
const chatController = new ChatController();

router.get(
    "/conversations/:userId",
    chatController.getUserConversations.bind(chatController)
);

router.get(
    "/messages/:conversationId",
    chatController.getMessagesByConversation.bind(chatController)
);

export default router;