import {
  Job,
  ViewedJob,
  Application,
  Favorite,
  Technology,
  User,
} from "../models/associations.js";
import { sequelize } from "./client.js";

await sequelize.sync({ force: true });

console.log("Synchronisation terminée");

// On pense a terminer la connexion à la BDD à la fin
await sequelize.close();
