import { Router } from "express";
import { controllerWrapper } from "../middlewares/controllerwrapper.middleware.js";
import { technologyController } from "../controllers/technology.controller.js";

export const techRouter = Router();

techRouter.get(
  "/technologies",
  controllerWrapper(technologyController.getTechnologies),
);
