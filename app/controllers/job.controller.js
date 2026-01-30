import { Job } from "../models/associations.js";
import { NotFoundError } from "../errors/not-found-error.js";

export const jobController = {
  getAllJobs: async (_, res, next) => {
    const jobs = await Job.findAll();

    if (jobs.length <= 0) {
      return next(new NotFoundError("Jobs non trouvés"));
    }

    res.status(200).json({ jobs });
  },
  getOneJob: async (req, res, next) => {
    const { id } = req.params;
    const job = await Job.findByPk(id);

    if (!job) {
      return next(new NotFoundError("Job non trouvé"));
    }

    res.status(200).json({ job });
  },
};
