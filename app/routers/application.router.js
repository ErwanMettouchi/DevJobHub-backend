import { Router } from "express";
import { controllerWrapper } from "../middlewares/controllerwrapper.middleware.js";
import { applicationController } from "../controllers/application.controller.js";

export const appRouter = Router();

appRouter.get(
  "/applications",
  controllerWrapper(applicationController.getApplications),
);
