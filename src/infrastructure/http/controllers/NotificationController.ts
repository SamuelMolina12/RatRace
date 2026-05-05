import { Request, Response } from "express";
import { GetMyNotificationsUseCase } from "../../../application/use-cases/notifications/GetMyNotificationsUseCase";
import { MarkNotificationAsReadUseCase } from "../../../application/use-cases/notifications/MarkNotificationAsReadUseCase";

export class NotificationController {
  async findMyNotifications(req: Request, res: Response) {
    const user = (req as any).user;
    const { unreadOnly } = req.query;

    const useCase = new GetMyNotificationsUseCase();

    const notifications = await useCase.execute(
      user.sub,
      unreadOnly === "true"
    );

    return res.status(200).json({
      success: true,
      data: notifications,
      message: "Notificaciones encontradas",
    });
  }

  async markAsRead(req: Request, res: Response) {
    const user = (req as any).user;
    const id = req.params.id as string;

    const useCase = new MarkNotificationAsReadUseCase();
    const notification = await useCase.execute(id, user.sub);

    return res.status(200).json({
      success: true,
      data: notification,
      message: "Notificación marcada como leída",
    });
  }
}