import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { ROLES } from "../../../shared/constants/role.constants";

const router = Router();
const adminController = new AdminController();

// Todas las rutas de admin requieren autenticación y rol ADMIN
router.use(authMiddleware);
router.use(requireRole(ROLES.ADMIN));

// Usuarios
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);

// Retos
router.get("/challenges", adminController.getAllChallenges);
router.patch("/challenges/:id/resolve", adminController.resolveChallenge);

export default router;
