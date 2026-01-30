import { Application } from "./application.model.js";
import { Favorite } from "./favorite.model.js";
import { Job } from "./job.model.js";
import { Technology } from "./technology.model.js";
import { User } from "./user.model.js";
import { ViewedJob } from "./viewed_job.model.js";

// User associations
User.hasMany(Application, { foreignKey: "userId", as: "applications" });
User.hasMany(Favorite, { foreignKey: "userId", as: "favorites" });
User.hasMany(ViewedJob, { foreignKey: "userId", as: "viewedJobs" });

// Application associations
Application.belongsTo(User, { foreignKey: "userId", as: "user" });
Application.belongsTo(Job, { foreignKey: "jobId", as: "job" });

// Favorite associations
Favorite.belongsTo(User, { foreignKey: "userId", as: "user" });
Favorite.belongsTo(Job, { foreignKey: "jobId", as: "job" });

// ViewedJob associations
ViewedJob.belongsTo(User, { foreignKey: "userId", as: "user" });
ViewedJob.belongsTo(Job, { foreignKey: "jobId", as: "job" });

// Job associations
Job.hasMany(Application, { foreignKey: "jobId", as: "applications" });
Job.hasMany(Favorite, { foreignKey: "jobId", as: "favorites" });
Job.hasMany(ViewedJob, { foreignKey: "jobId", as: "viewedJobs" });
Job.belongsToMany(Technology, {
  through: "associer",
  foreignKey: "jobId",
  otherKey: "technologyId",
  as: "technologies",
});

// Technology associations
Technology.belongsToMany(Job, {
  through: "associer",
  foreignKey: "technologyId",
  otherKey: "jobId",
  as: "jobs",
});

export { Technology, Job, User, ViewedJob, Favorite, Application };
