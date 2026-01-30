import { Technology } from "../models/associations.js";
import { NotFoundError } from "../errors/not-found-error.js";

export const technologyController = {
  getTechnologies: async (req, res, next) => {
    const technologies = await Technology.findAll();

    res.status(200).json(technologies);
  },
};
