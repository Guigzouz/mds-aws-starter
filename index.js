const express = require("express");

const { PrismaClient } = require("@prisma/client");

const {
  SecretsManagerClient,
  GetSecretValueCommand,
} = require("@aws-sdk/client-secrets-manager");

const secret_name = process.env.RDS_CLUSTER_SECRET; // Use process.env to access environment variables
const client = new SecretsManagerClient({
  region: "eu-west-3",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function getSecret() {
  let response;

  try {
    response = await client.send(
      new GetSecretValueCommand({
        SecretId: secret_name,
        VersionStage: "AWSCURRENT", // VersionStage defaults to AWSCURRENT if unspecified
      })
    );
  } catch (error) {
    // For a list of exceptions thrown, see
    // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
    throw error;
  }

  const secret = response.SecretString;
}

getSecret(); // Call the async function

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
