import { Router } from "express";
import { jobRouter } from "./job.router.js";
import { appRouter } from "./application.router.js";
import { techRouter } from "./technology.router.js";
import { favoriteRouter } from "./favorite.router.js";
import { viewedJobRouter } from "./viewed_job.router.js";

export const router = Router();

router.use(jobRouter);
router.use(appRouter);
router.use(techRouter);
router.use(favoriteRouter);
router.use(viewedJobRouter);
