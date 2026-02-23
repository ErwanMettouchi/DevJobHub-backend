import { Router } from "express";
import { controllerWrapper } from "../middlewares/controllerwrapper.middleware.js";
import { viewedJobController } from "../controllers/viewed_job.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const viewedJobRouter = Router();

/**
 * @swagger
 * /viewed-jobs:
 *   get:
 *     summary: Récupère les jobs consultés par l'utilisateur connecté
 *     tags: [Jobs consultés]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des jobs consultés
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ViewedJob'
 *       401:
 *         description: Non authentifié
 */
// L'ordre des middlewares compte : authMiddleware vérifie le token AVANT que le controller s'exécute
// Si le token est invalide, authMiddleware renvoie une erreur 401 et le controller n'est jamais appelé
viewedJobRouter.get(
  "/viewed-jobs",
  authMiddleware,
  controllerWrapper(viewedJobController.getViewedJobs),
);

/**
 * @swagger
 * /viewed-jobs:
 *   post:
 *     summary: Marquer un job comme consulté
 *     tags: [Jobs consultés]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - jobId
 *             properties:
 *               jobId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Job marqué comme consulté
 *       200:
 *         description: Job déjà consulté, timestamp mis à jour
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Job non trouvé
 */
viewedJobRouter.post(
  "/viewed-jobs",
  authMiddleware,
  controllerWrapper(viewedJobController.addViewedJob),
);
