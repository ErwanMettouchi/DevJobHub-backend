import { ViewedJob } from "../models/associations.js";
import { NotFoundError } from "../errors/not-found-error.js";

export const viewedJobController = {
  getViewedJobs: async (req, res, next) => {
    const viewedJobs = await ViewedJob.findAll();

    res.status(200).json(viewedJobs);
  },
};
