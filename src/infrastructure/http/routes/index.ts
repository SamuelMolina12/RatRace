import { Router } from "express";

const router = Router();

router.get("/rat", (req, res) => {
  res.json({
    success: true,
    message: "Rat Race esta ejecutando"
  });
});

export default router;