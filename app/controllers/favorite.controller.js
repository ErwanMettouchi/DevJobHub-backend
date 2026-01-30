import { Favorite } from "../models/associations.js";
import { NotFoundError } from "../errors/not-found-error.js";

export const favoriteController = {
  getFavorites: async (req, res, next) => {
    const favorites = await Favorite.findAll();

    res.status(200).json(favorites);
  },
};
