import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../data/client.js";

export class Application extends Sequelize.Model {}
Application.init(
  {
    status: {
      type: DataTypes.ENUM("applied", "interview", "no_response", "offer", "rejected", "accepted"),
      allowNull: false,
      defaultValue: "applied",
    },
    note: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: "application",
    timestamps: true,
  },
);
