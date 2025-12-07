import express from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth.middleware";

const router = express.Router();

router.post("/", userControllers.createUser);

router.get("/", auth("admin"), userControllers.getUser);

router.put("/:userId", auth("admin", "customer"), userControllers.updateUser);

router.delete("/:userId", userControllers.deleteUser);

export const userRoutes = router;