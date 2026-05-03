import { Router } from "express";
import authRoutes from "./auth.routes";
import usersRoutes from "./users.routes";
import vehiclesRoutes from "./vehicles.routes";

const router = Router();

router.get("/rat", (req, res) => {
  res.json({
    success: true,
    message: "Rat Race esta ejecutando"
  });
});

router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/vehicles", vehiclesRoutes);

export default router;