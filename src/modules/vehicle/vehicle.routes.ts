import express from "express";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth.middleware";


const router = express.Router();

router.post("/", auth("admin"), vehicleControllers.createVehicle);

router.get("/", vehicleControllers.getVehicle);

router.get("/:vehicleId", vehicleControllers.getSingleVehicle);

router.put("/:vehicleId", auth("admin"), vehicleControllers.updateVehicle);

router.delete("/:vehicleId", vehicleControllers.deleteVehicle);


export const vehicleRoutes = router;