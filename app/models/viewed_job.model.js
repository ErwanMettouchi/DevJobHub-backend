import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../data/client.js";

export class ViewedJob extends Sequelize.Model {}

ViewedJob.init(
  {},
  {
    sequelize,
    tableName: "viewed_job",
  },
);
