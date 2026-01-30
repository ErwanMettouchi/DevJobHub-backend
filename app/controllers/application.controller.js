import { Application } from "../models/associations.js";
import { NotFoundError } from "../errors/not-found-error.js";

export const applicationController = {
  getApplications: async (req, res, next) => {
    const applications = await Application.findAll();

    res.status(200).json(applications);
  },
};
