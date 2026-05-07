import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { requireRole } from "../middlewares/roleMiddleware";
import { ROLES } from "../../../shared/constants/role.constants";

const router = Router();
const adminController = new AdminController();


router.use(authMiddleware);
router.use(requireRole(ROLES.ADMIN));

router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/role", adminController.updateUserRole);

router.get("/challenges", adminController.getAllChallenges);
router.patch("/challenges/:id/resolve", adminController.resolveChallenge);

export default router;
