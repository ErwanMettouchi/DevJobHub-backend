import { Router } from "express";
import { controllerWrapper } from "../middlewares/controllerwrapper.middleware.js";
import { jobController } from "../controllers/job.controller.js";

export const jobRouter = Router();

/**
 * @openapi
 * /jobs:
 *   get:
 *     summary: Récupère toutes les offres d'emploi
 *     tags: [Jobs]
 *     responses:
 *       200:
 *         description: Liste des jobs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 jobs:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Job'
 *       404:
 *         description: Aucun job trouvé
 */
jobRouter.get("/jobs", controllerWrapper(jobController.getAllJobs));

/**
 * @openapi
 * /jobs/{id}:
 *   get:
 *     summary: Récupère un job par son ID
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du job
 *     responses:
 *       200:
 *         description: Détails du job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *       404:
 *         description: Job non trouvé
 */
jobRouter.get("/jobs/:id", controllerWrapper(jobController.getOneJob));
