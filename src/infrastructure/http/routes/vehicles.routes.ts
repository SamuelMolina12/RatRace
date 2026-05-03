import { Router } from "express";
import { CreateVehicleUseCase } from "../../../application/use-cases/vehicles/CreateVehicleUseCase";
import { DeleteVehicleUseCase } from "../../../application/use-cases/vehicles/DeleteVehicleUseCase";
import { GetMyVehiclesUseCase } from "../../../application/use-cases/vehicles/GetMyVehiclesUseCase";
import { GetVehicleByIdUseCase } from "../../../application/use-cases/vehicles/GetVehicleByIdUseCase";
import { SetActiveVehicleUseCase } from "../../../application/use-cases/vehicles/SetActiveVehicleUseCase";
import { UpdateVehicleUseCase } from "../../../application/use-cases/vehicles/UpdateVehicleUseCase";
import { PrismaVehicleRepository } from "../../database/prisma/PrismaVehicleRepository";
import { VehiclesController } from "../controllers/VehiclesController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

const vehicleRepository = new PrismaVehicleRepository();

const createVehicleUseCase = new CreateVehicleUseCase(vehicleRepository);
const getMyVehiclesUseCase = new GetMyVehiclesUseCase(vehicleRepository);
const getVehicleByIdUseCase = new GetVehicleByIdUseCase(vehicleRepository);
const updateVehicleUseCase = new UpdateVehicleUseCase(vehicleRepository);
const deleteVehicleUseCase = new DeleteVehicleUseCase(vehicleRepository);
const setActiveVehicleUseCase = new SetActiveVehicleUseCase(vehicleRepository);

const vehiclesController = new VehiclesController(
  createVehicleUseCase,
  getMyVehiclesUseCase,
  getVehicleByIdUseCase,
  updateVehicleUseCase,
  deleteVehicleUseCase,
  setActiveVehicleUseCase
);

router.get("/", authMiddleware, vehiclesController.getMyVehicles);
router.get("/:id", authMiddleware, vehiclesController.getById);
router.post("/", authMiddleware, vehiclesController.create);
router.put("/:id", authMiddleware, vehiclesController.update);
router.delete("/:id", authMiddleware, vehiclesController.delete);
router.patch("/:id/active", authMiddleware, vehiclesController.setActive);

export default router;