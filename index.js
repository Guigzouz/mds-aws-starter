const express = require("express");

const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Route de test
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Nouvelle route pour se connecter à la BDD et récupérer des utilisateurs
app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({
      error: "Une erreur est survenue lors de la récupération des utilisateurs",
    });
  }
});

// Assurez-vous de fermer la connexion Prisma lors de la fermeture de l'application
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = app; // Export the app for testing
