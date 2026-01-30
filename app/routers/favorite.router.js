import { Router } from "express";
import { controllerWrapper } from "../middlewares/controllerwrapper.middleware.js";
import { favoriteController } from "../controllers/favorite.controller.js";

export const favoriteRouter = Router();

favoriteRouter.get(
  "/favorites",
  controllerWrapper(favoriteController.getFavorites),
);
