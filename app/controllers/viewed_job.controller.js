import { ViewedJob, Job } from "../models/associations.js";
import { NotFoundError } from "../errors/not-found-error.js";

export const viewedJobController = {
  // Récupérer tous les jobs consultés par l'utilisateur connecté
  getViewedJobs: async (req, res, next) => {
    const viewedJobs = await ViewedJob.findAll({
      where: { userId: req.user.id },
      include: { association: "job" },
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json(viewedJobs);
  },
  // Marquer un job comme consulté par l'utilisateur connecté
  addViewedJob: async (req, res, next) => {
    const { id: userId } = req.user;
  },
};
