import { verifyToken } from "../helpers/jwt.js";
import { UnauthorizedError } from "../errors/unauthorized-error.js";

/**
 * Middleware d'authentification JWT
 *
 * Ce middleware vérifie que l'utilisateur est connecté en validant son token JWT.
 * Il s'utilise sur les routes qui nécessitent une authentification.
 *
 * Exemple d'utilisation dans un router :
 * router.get("/profile", authMiddleware, userController.getProfile);
 */
export const authMiddleware = (req, res, next) => {
  // 1. Récupérer le header Authorization
  // Format attendu : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const authHeader = req.headers.authorization;

  // 2. Vérifier que le header existe et commence par "Bearer "
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Token manquant ou mal formaté"));
  }

  // 3. Extraire le token (tout ce qui vient après "Bearer ")
  const token = authHeader.split(" ")[1];

  try {
    // 4. Vérifier et décoder le token
    // Si le token est valide, verifyToken retourne le payload (ex: { id: 1, iat: ..., exp: ... })
    // Si le token est invalide ou expiré, il throw une erreur
    const decoded = verifyToken(token);

    // 5. Attacher les infos de l'utilisateur à la requête
    // Comme ça, les controllers suivants peuvent accéder à req.user
    req.user = decoded;

    // 6. Passer au middleware/controller suivant
    next();
  } catch (error) {
    // 7. Gérer les différents types d'erreurs JWT
    if (error.name === "TokenExpiredError") {
      return next(
        new UnauthorizedError("Token expiré, veuillez vous reconnecter"),
      );
    }

    // Token invalide, malformé, signature incorrecte, etc.
    return next(new UnauthorizedError("Token invalide"));
  }
};
