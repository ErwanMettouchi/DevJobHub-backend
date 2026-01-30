import { Router } from "express";
import { controllerWrapper } from "../middlewares/controllerwrapper.middleware.js";
import { viewedJobController } from "../controllers/viewed_job.controller.js";

export const viewedJobRouter = Router();

viewedJobRouter.get(
  "/viewed-jobs",
  controllerWrapper(viewedJobController.getViewedJobs),
);
