import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth.middleware";
// import logger from "../../middleware/logger";


const router = express.Router();

// routes -> controller -> service

router.post("/", userControllers.createUser);

router.get("/", auth("admin"), userControllers.getUser);

// router.get("/:id", auth("admin", "user"), userControllers.getSingleUser);

router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);

router.delete("/:userId", userControllers.deleteUser);

export const userRoutes = router;