/**
 * =============================================================================
 * TEST D'IMPORT DE JOBS DEPUIS L'API FRANCE TRAVAIL
 * =============================================================================
 *
 * ÉTAPE 1 : Créer un compte sur https://francetravail.io/data/api
 * ÉTAPE 2 : Créer une application pour obtenir tes identifiants (client_id, client_secret)
 * ÉTAPE 3 : Ajouter ces identifiants dans ton fichier .env
 *
 * L'API France Travail utilise OAuth2, donc on doit :
 *   1. D'abord récupérer un "token" d'accès
 *   2. Ensuite utiliser ce token pour faire nos requêtes
 */

import axios from "axios";
import dotenv from "dotenv";

// Charge les variables d'environnement depuis .env
dotenv.config();

// =============================================================================
// CONFIGURATION
// =============================================================================

// Tes identifiants API (à mettre dans .env)
const CLIENT_ID = process.env.FRANCE_TRAVAIL_CLIENT_ID;
const CLIENT_SECRET = process.env.FRANCE_TRAVAIL_CLIENT_SECRET;

// URLs de l'API France Travail
const AUTH_URL = "https://entreprise.francetravail.fr/connexion/oauth2/access_token";
const API_URL = "https://api.francetravail.io/partenaire/offresdemploi/v2/offres/search";

// =============================================================================
// ÉTAPE 1 : RÉCUPÉRER LE TOKEN D'ACCÈS
// =============================================================================

/**
 * OAuth2 fonctionne comme ça :
 * - Tu envoies tes identifiants (client_id + client_secret)
 * - L'API te renvoie un "token" (une clé temporaire)
 * - Tu utilises ce token pour toutes tes requêtes suivantes
 * - Le token expire après un certain temps (généralement 1h)
 */
async function getAccessToken() {
  try {
    // On envoie nos identifiants pour obtenir un token
    const response = await axios.post(
      AUTH_URL,
      // Les données sont envoyées en "x-www-form-urlencoded" (pas en JSON)
      new URLSearchParams({
        grant_type: "client_credentials", // Type d'authentification
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: "api_offresdemploiv2 o2dsoffre", // Les permissions qu'on demande
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    console.log("✅ Token obtenu avec succès !");
    return response.data.access_token;
  } catch (error) {
    console.error("❌ Erreur lors de la récupération du token :");
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// =============================================================================
// ÉTAPE 2 : CHERCHER DES OFFRES D'EMPLOI
// =============================================================================

/**
 * Une fois qu'on a le token, on peut chercher des offres.
 * L'API permet de filtrer par :
 * - motsCles : mots-clés (ex: "développeur javascript")
 * - typeContrat : CDI, CDD, etc.
 * - experience : 1 (moins d'1 an), 2 (1-3 ans), 3 (plus de 3 ans)
 * - range : pagination (ex: "0-14" pour les 15 premiers résultats)
 */
async function searchJobs(token) {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        // On passe le token dans le header "Authorization"
        Authorization: `Bearer ${token}`,
      },
      params: {
        // Paramètres de recherche
        motsCles: "développeur javascript", // Mots-clés de recherche
        experience: 1, // 1 = débutant (moins d'1 an d'expérience)
        range: "0-14", // Récupère les 15 premières offres (0 à 14)
      },
    });

    console.log(`✅ ${response.data.resultats.length} offres trouvées !`);
    return response.data.resultats;
  } catch (error) {
    console.error("❌ Erreur lors de la recherche :");
    console.error(error.response?.data || error.message);
    throw error;
  }
}

// =============================================================================
// ÉTAPE 3 : TRANSFORMER LES DONNÉES POUR NOTRE BASE
// =============================================================================

/**
 * L'API renvoie les données dans son propre format.
 * On doit les transformer pour correspondre à notre modèle Job.
 *
 * C'est ici que tu adaptes les données de l'API à ta structure.
 */
function transformJob(apiFranceTravailJob) {
  // L'objet renvoyé par l'API France Travail ressemble à ça :
  // {
  //   id: "123456",
  //   intitule: "Développeur web",
  //   entreprise: { nom: "Ma Startup" },
  //   lieuTravail: { libelle: "Paris" },
  //   typeContrat: "CDI",
  //   experienceExige: "D",
  //   salaire: { libelle: "30000-35000€/an" },
  //   description: "...",
  //   origineOffre: { urlOrigine: "https://..." },
  //   dateCreation: "2025-01-20T10:00:00Z"
  // }

  return {
    externalId: apiFranceTravailJob.id, // ID unique de l'offre chez France Travail
    source: "FranceTravail", // Notre identifiant de source
    company: apiFranceTravailJob.entreprise?.nom || "Entreprise non précisée",
    title: apiFranceTravailJob.intitule,
    location: apiFranceTravailJob.lieuTravail?.libelle || "Non précisé",
    remote: detectRemote(apiFranceTravailJob), // Fonction helper ci-dessous
    contractType: mapContractType(apiFranceTravailJob.typeContrat), // Fonction helper
    salaryMin: null, // France Travail donne le salaire en texte, difficile à parser
    salaryMax: null,
    description: apiFranceTravailJob.description || "",
    url: apiFranceTravailJob.origineOffre?.urlOrigine || `https://candidat.francetravail.fr/offres/recherche/detail/${apiFranceTravailJob.id}`,
    postedAt: apiFranceTravailJob.dateCreation ? new Date(apiFranceTravailJob.dateCreation) : null,
    isActive: true,
  };
}

/**
 * Détecte si l'offre est en télétravail.
 * France Travail n'a pas un champ simple pour ça, on doit chercher dans le texte.
 */
function detectRemote(job) {
  const text = `${job.intitule} ${job.description || ""}`.toLowerCase();

  if (text.includes("full remote") || text.includes("100% télétravail")) {
    return "full";
  }
  if (text.includes("télétravail") || text.includes("remote")) {
    return "partial";
  }
  return "not_specified";
}

/**
 * Convertit le type de contrat France Travail vers notre ENUM.
 * France Travail utilise : CDI, CDD, MIS (intérim), SAI (saisonnier), etc.
 */
function mapContractType(franceTravailType) {
  const mapping = {
    CDI: "CDI",
    CDD: "CDD",
    MIS: "CDD", // Intérim -> on le met en CDD
    SAI: "CDD", // Saisonnier -> CDD
    LIB: "freelance", // Libéral
  };
  return mapping[franceTravailType] || null;
}

// =============================================================================
// ÉTAPE 4 : TOUT ASSEMBLER
// =============================================================================

async function main() {
  console.log("🚀 Démarrage de l'import...\n");

  // Vérifier que les identifiants sont configurés
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.error("❌ Configure FRANCE_TRAVAIL_CLIENT_ID et FRANCE_TRAVAIL_CLIENT_SECRET dans ton .env");
    console.log("\n📝 Pour obtenir ces identifiants :");
    console.log("   1. Va sur https://francetravail.io/data/api");
    console.log("   2. Crée un compte");
    console.log("   3. Crée une application");
    console.log("   4. Copie le client_id et client_secret dans .env");
    return;
  }

  // 1. Obtenir le token
  console.log("1️⃣ Récupération du token d'accès...");
  const token = await getAccessToken();

  // 2. Chercher des offres
  console.log("\n2️⃣ Recherche d'offres d'emploi...");
  const jobs = await searchJobs(token);

  // 3. Transformer les données
  console.log("\n3️⃣ Transformation des données...\n");
  const transformedJobs = jobs.map(transformJob);

  // 4. Afficher le résultat (pour le test)
  console.log("=".repeat(60));
  console.log("OFFRES TRANSFORMÉES (prêtes pour la base de données) :");
  console.log("=".repeat(60));

  transformedJobs.forEach((job, index) => {
    console.log(`\n📌 Offre ${index + 1}:`);
    console.log(`   Titre: ${job.title}`);
    console.log(`   Entreprise: ${job.company}`);
    console.log(`   Lieu: ${job.location}`);
    console.log(`   Contrat: ${job.contractType}`);
    console.log(`   Remote: ${job.remote}`);
    console.log(`   Source: ${job.source}`);
    console.log(`   External ID: ${job.externalId}`);
  });

  // =============================================================================
  // ÉTAPE 5 (À FAIRE ENSUITE) : SAUVEGARDER EN BASE
  // =============================================================================
  //
  // Une fois que tu as vérifié que ça marche, tu pourras ajouter :
  //
  // import { Job } from "./app/models/associations.js";
  //
  // for (const jobData of transformedJobs) {
  //   await Job.upsert(jobData);
  //   // upsert = insert si n'existe pas, update si existe déjà
  //   // Grâce à ton index unique (externalId + source), pas de doublons !
  // }
  //
  // console.log("✅ Jobs sauvegardés en base !");
}

// Lancer le script
main().catch(console.error);
