import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import vehiclesRoutes from "./vehicles.routes";
import chatRoutes from "./chat.routes";
import challengeRoutes from "./challenge.routes";
import notificationRoutes from "./notification.routes";
import adminRoutes from "./admin.routes";

const router = Router();

router.get("/rat", (req, res) => {
  res.json({
    success: true,
    message: "Rat Race esta ejecutando",
  });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/vehicles", vehiclesRoutes);
router.use("/chat", chatRoutes);
router.use("/challenges", challengeRoutes);
router.use("/notifications", notificationRoutes);
router.use("/admin", adminRoutes);

export default router;
