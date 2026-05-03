import { Router } from "express";
import { GetUserProfileUseCase } from "../../../application/use-cases/users/GetUserProfileUseCase";
import { UpdateMyProfileUseCase } from "../../../application/use-cases/users/UpdateMyProfileUseCase";
import { PrismaUserRepository } from "../../database/prisma/PrismaUserRepository";
import { UsersController } from "../controllers/UsersController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

const userRepository = new PrismaUserRepository();

const getUserProfileUseCase = new GetUserProfileUseCase(userRepository);
const updateMyProfileUseCase = new UpdateMyProfileUseCase(userRepository);

const usersController = new UsersController(
  getUserProfileUseCase,
  updateMyProfileUseCase
);

router.get("/me", authMiddleware, usersController.getMe);
router.put("/me", authMiddleware, usersController.updateMe);

router.get("/:id", authMiddleware, usersController.getById);

export default router;