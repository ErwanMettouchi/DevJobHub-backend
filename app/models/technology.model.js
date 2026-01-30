import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../data/client.js";

export class Technology extends Sequelize.Model {}
Technology.init(
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    category: {
      type: DataTypes.ENUM(
        "frontend",
        "backend",
        "database",
        "devops",
        "mobile",
        "other",
      ),
    },
  },
  {
    sequelize,
    tableName: "technology",
  },
);
