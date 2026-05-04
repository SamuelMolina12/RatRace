import { Router } from "express";
import { ChallengeController } from "../controllers/ChallengeController";
import { authMiddleware } from "../middlewares/authMiddleware";

const challengeRoutes = Router();
const challengeController = new ChallengeController();

challengeRoutes.post("/", authMiddleware, (req, res) =>
  challengeController.create(req, res)
);

challengeRoutes.get("/my", authMiddleware, (req, res) =>
  challengeController.findMyChallenges(req, res)
);

challengeRoutes.get("/user/:userId", authMiddleware, (req, res) =>
  challengeController.findUserChallenges(req, res)
);

challengeRoutes.get("/:id", authMiddleware, (req, res) =>
  challengeController.findById(req, res)
);

challengeRoutes.patch("/:id/accept", authMiddleware, (req, res) =>
  challengeController.accept(req, res)
);

challengeRoutes.patch("/:id/reject", authMiddleware, (req, res) =>
  challengeController.reject(req, res)
);

challengeRoutes.patch("/:id/cancel", authMiddleware, (req, res) =>
  challengeController.cancel(req, res)
);

challengeRoutes.patch("/:id/start", authMiddleware, (req, res) =>
  challengeController.start(req, res)
);

challengeRoutes.patch("/:id/complete", authMiddleware, (req, res) =>
  challengeController.complete(req, res)
);

export default challengeRoutes;