import { Router } from "express";
import { NotificationController } from "../controllers/NotificationController";
import { authMiddleware } from "../middlewares/authMiddleware";

const notificationRoutes = Router();
const notificationController = new NotificationController();

notificationRoutes.get("/my", authMiddleware, (req, res) =>
  notificationController.findMyNotifications(req, res)
);

notificationRoutes.patch("/:id/read", authMiddleware, (req, res) =>
  notificationController.markAsRead(req, res)
);

export default notificationRoutes;