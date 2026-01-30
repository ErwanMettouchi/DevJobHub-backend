import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../data/client.js";

export class Job extends Sequelize.Model {}

Job.init(
  {
    externalId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING(5),
      allowNull: true,
    },
    department: {
      type: DataTypes.STRING(3),
      allowNull: true,
    },
    remote: {
      type: DataTypes.ENUM("full", "partial", "none", "not_specified"),
      defaultValue: "not_specified",
    },
    contractType: {
      type: DataTypes.ENUM("CDI", "CDD", "stage", "alternance", "freelance"),
      allowNull: true,
    },
    salaryMin: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    salaryMax: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "job",
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["externalId", "source"],
        name: "unique_external_job",
      },
      {
        fields: ["city"],
        name: "idx_job_city",
      },
      {
        fields: ["department"],
        name: "idx_job_department",
      },
    ],
  },
);
