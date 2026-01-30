import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DevJobHub API",
      version: "1.0.0",
      description: "API pour la recherche d'offres d'emploi développeur junior",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Serveur de développement",
      },
    ],
    components: {
      schemas: {
        Job: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            externalId: { type: "string", example: "abc123" },
            company: { type: "string", example: "TechCorp" },
            title: { type: "string", example: "Développeur Junior React" },
            location: { type: "string", example: "Paris" },
            remote: {
              type: "string",
              enum: ["full", "partial", "none", "not_specified"],
              example: "partial",
            },
            contractType: {
              type: "string",
              enum: ["CDI", "CDD", "stage", "alternance", "freelance"],
              example: "CDI",
            },
            salaryMin: { type: "integer", nullable: true, example: 35000 },
            salaryMax: { type: "integer", nullable: true, example: 42000 },
            description: { type: "string", nullable: true },
            url: { type: "string", example: "https://example.com/job/123" },
            source: { type: "string", example: "welcometothejungle" },
            postedAt: { type: "string", format: "date-time", nullable: true },
            isActive: { type: "boolean", example: true },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./app/routers/*.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
