import express from "express";
import cors from "cors";
import sequelize from "./app/data/client.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
