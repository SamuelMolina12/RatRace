import { Router } from "express";
import { AdminController } from "../controllers/AdminController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authorizeAdmin } from "../middlewares/authorizeAdmin";
import { PrismaUserRepository } from "../../database/prisma/PrismaUserRepository";
import { PrismaAdminRepository } from "../../database/prisma/PrismaAdminRepository";
import { GetAllAdminUsersUseCase } from "../../../application/use-cases/admin/GetAllAdminUsersUseCase";
import { GetUserByIdUseCase } from "../../../application/use-cases/admin/GetUserByIdUseCase";
import { SuspendUserUseCase } from "../../../application/use-cases/admin/SuspendUserUseCase";
import { ActivateUserUseCase } from "../../../application/use-cases/admin/ActivateUserUseCase";
import { GetAdminDashboardUseCase } from "../../../application/use-cases/admin/GetAdminDashboardUseCase";
import { AdminDashboardService } from "../../../application/services/AdminDashboardService";
import { UpdateUserRoleUseCase } from "../../../application/use-cases/admin/UpdateUserRoleUseCase";
import { GetAllChallengesUseCase } from "../../../application/use-cases/admin/GetAllChallengesUseCase";
import { ResolveChallengeUseCase } from "../../../application/use-cases/admin/ResolveChallengeUseCase";

const router = Router();
const userRepository = new PrismaUserRepository();
const adminRepository = new PrismaAdminRepository();

const getAllUsersUseCase = new GetAllAdminUsersUseCase(userRepository);
const getUserByIdUseCase = new GetUserByIdUseCase(userRepository);
const suspendUserUseCase = new SuspendUserUseCase(userRepository);
const activateUserUseCase = new ActivateUserUseCase(userRepository);
const adminDashboardService = new AdminDashboardService(adminRepository);
const getAdminDashboardUseCase = new GetAdminDashboardUseCase(
  adminDashboardService,
);
const updateUserRoleUseCase = new UpdateUserRoleUseCase(userRepository);
const getAllChallengesUseCase = new GetAllChallengesUseCase();
const resolveChallengeUseCase = new ResolveChallengeUseCase();

const adminController = new AdminController(
  getAllUsersUseCase,
  getUserByIdUseCase,
  suspendUserUseCase,
  activateUserUseCase,
  getAdminDashboardUseCase,
  updateUserRoleUseCase,
  getAllChallengesUseCase,
  resolveChallengeUseCase,
);

router.use(authMiddleware);
router.use(authorizeAdmin);

router.get("/dashboard", adminController.getDashboard);
router.get("/users", adminController.getAllUsers);
router.get("/users/:id", adminController.getUserById);
router.patch("/users/:id/suspend", adminController.suspendUser);
router.patch("/users/:id/activate", adminController.activateUser);
router.patch("/users/:id/role", adminController.updateUserRole);

router.get("/challenges", adminController.getAllChallenges);
router.patch("/challenges/:id/resolve", adminController.resolveChallenge);

export default router;
