import {
  Job,
  ViewedJob,
  Application,
  Favorite,
  Technology,
  User,
} from "../models/associations.js";
import { sequelize } from "./client.js";

async function seed() {
  try {
    // Users
    const users = await User.bulkCreate([
      {
        email: "alice@example.com",
        password: "$2b$10$hashedpassword123456789",
        firstName: "Alice",
        lastName: "Dupont",
      },
      {
        email: "bob@example.com",
        password: "$2b$10$hashedpassword987654321",
        firstName: "Bob",
        lastName: "Martin",
      },
    ]);
    console.log("Users created");

    // Technologies
    const technologies = await Technology.bulkCreate([
      { name: "JavaScript", category: "frontend" },
      { name: "Node.js", category: "backend" },
      { name: "PostgreSQL", category: "database" },
      { name: "React", category: "frontend" },
      { name: "Docker", category: "devops" },
    ]);
    console.log("Technologies created");

    // Jobs
    const jobs = await Job.bulkCreate([
      {
        externalId: "ft-123456",
        company: "TechCorp",
        title: "Développeur Full Stack Junior",
        location: "75 - Paris 11ème",
        city: "Paris",
        postalCode: "75011",
        department: "75",
        remote: "partial",
        contractType: "CDI",
        salaryMin: 35000,
        salaryMax: 42000,
        description:
          "Rejoignez notre équipe pour développer des applications web modernes.",
        url: "https://techcorp.fr/jobs/fullstack-junior",
        source: "FranceTravail",
        postedAt: new Date("2025-01-20"),
      },
      {
        externalId: "ft-789012",
        company: "StartupIA",
        title: "Développeur Backend Node.js",
        location: "69 - Lyon 3ème",
        city: "Lyon",
        postalCode: "69003",
        department: "69",
        remote: "full",
        contractType: "CDI",
        salaryMin: 38000,
        salaryMax: 45000,
        description:
          "Développez des APIs performantes pour notre plateforme IA.",
        url: "https://startupia.io/careers/backend",
        source: "FranceTravail",
        postedAt: new Date("2025-01-22"),
      },
      {
        externalId: "ft-345678",
        company: "DataSoft",
        title: "Développeur React Junior",
        location: "33 - Bordeaux",
        city: "Bordeaux",
        postalCode: "33000",
        department: "33",
        remote: "partial",
        contractType: "alternance",
        salaryMin: null,
        salaryMax: null,
        description:
          "Alternance pour développer des interfaces utilisateur modernes en React.",
        url: "https://datasoft.fr/jobs/react-junior",
        source: "FranceTravail",
        postedAt: new Date("2025-01-18"),
      },
      {
        externalId: "ft-901234",
        company: "CloudNet",
        title: "DevOps Junior",
        location: "31 - Toulouse",
        city: "Toulouse",
        postalCode: "31000",
        department: "31",
        remote: "none",
        contractType: "CDI",
        salaryMin: 32000,
        salaryMax: 38000,
        description:
          "Gérez et automatisez notre infrastructure cloud.",
        url: "https://cloudnet.io/careers/devops",
        source: "FranceTravail",
        postedAt: new Date("2025-01-25"),
      },
      {
        externalId: "adzuna-567890",
        company: "WebAgency",
        title: "Développeur PHP/Symfony Junior",
        location: "44 - Nantes",
        city: "Nantes",
        postalCode: "44000",
        department: "44",
        remote: "partial",
        contractType: "CDD",
        salaryMin: 28000,
        salaryMax: 34000,
        description:
          "Développez des applications web avec Symfony pour nos clients.",
        url: "https://webagency.fr/jobs/php-symfony",
        source: "Adzuna",
        postedAt: new Date("2025-01-21"),
      },
      {
        externalId: "remoteok-111222",
        company: "RemoteTech",
        title: "Développeur JavaScript Full Remote",
        location: "Remote - France",
        city: null,
        postalCode: null,
        department: null,
        remote: "full",
        contractType: "freelance",
        salaryMin: 40000,
        salaryMax: 55000,
        description:
          "Travaillez de n'importe où sur des projets JavaScript variés.",
        url: "https://remotetech.io/jobs/js-remote",
        source: "RemoteOK",
        postedAt: new Date("2025-01-23"),
      },
    ]);
    console.log("Jobs created");

    // Associate technologies with jobs
    // TechCorp - Full Stack: JS, Node, React
    await jobs[0].addTechnologies([
      technologies[0],
      technologies[1],
      technologies[3],
    ]);
    // StartupIA - Backend: Node, PostgreSQL, Docker
    await jobs[1].addTechnologies([
      technologies[1],
      technologies[2],
      technologies[4],
    ]);
    // DataSoft - React: JS, React
    await jobs[2].addTechnologies([
      technologies[0],
      technologies[3],
    ]);
    // CloudNet - DevOps: Docker, Node
    await jobs[3].addTechnologies([
      technologies[4],
      technologies[1],
    ]);
    // WebAgency - PHP (pas de techno dans la liste, on skip)
    // RemoteTech - JS: JavaScript, Node, React
    await jobs[5].addTechnologies([
      technologies[0],
      technologies[1],
      technologies[3],
    ]);
    console.log("Job-Technology associations created");

    // Applications
    await Application.bulkCreate([
      {
        userId: users[0].id,
        jobId: jobs[0].id,
        status: "applied",
        note: "Candidature envoyée via le site",
      },
      {
        userId: users[1].id,
        jobId: jobs[1].id,
        status: "interview",
        note: "Entretien prévu la semaine prochaine",
      },
    ]);
    console.log("Applications created");

    // Favorites
    await Favorite.bulkCreate([
      { userId: users[0].id, jobId: jobs[1].id },
      { userId: users[1].id, jobId: jobs[0].id },
    ]);
    console.log("Favorites created");

    // Viewed Jobs
    await ViewedJob.bulkCreate([
      { userId: users[0].id, jobId: jobs[0].id },
      { userId: users[0].id, jobId: jobs[1].id },
      { userId: users[1].id, jobId: jobs[1].id },
    ]);
    console.log("ViewedJobs created");

    console.log("Seeding terminé avec succès !");
  } catch (error) {
    console.error("Erreur lors du seeding:", error);
  } finally {
    await sequelize.close();
  }
}

seed();
