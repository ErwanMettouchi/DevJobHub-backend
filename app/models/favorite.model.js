import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../data/client.js";

export class Favorite extends Sequelize.Model {}

Favorite.init(
  {},
  {
    sequelize,
    tableName: "favorite",
  },
);
