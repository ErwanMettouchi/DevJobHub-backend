import express from "express";
import cors from "cors";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";
import sequelize from "./app/data/client.js";
import { router } from "./app/routers/router.js";
import { swaggerSpec } from "./app/config/swagger.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Router
app.use("/", router);

// Server launch
const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("Connexion à la base de données réussie!");
    app.listen(port, () => {
      console.log(
        `✨🌟⭐ API DevJobHub lancée sur http://localhost:${port} ⭐🌟✨`,
      );
    });
  } catch (error) {
    console.error("Impossible de se connecter à la base de données", error);
  }
}

await startServer();
