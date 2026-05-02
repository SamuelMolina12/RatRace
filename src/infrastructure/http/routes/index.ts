import { Router } from "express";
import authRoutes from "./auth.routes";

const router = Router();

router.get("/rat", (req, res) => {
  res.json({
    success: true,
    message: "Rat Race esta ejecutando"
  });
});

router.use("/auth", authRoutes);

export default router;