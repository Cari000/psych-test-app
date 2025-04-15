import express from "express";
import { PrismaClient } from './generated/prisma/index.js';
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient(); // Create an instance of Prisma Client

app.use(cors());
app.use(express.json());

app.post("/api/users", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Nome é obrigatório" });

  try {
    const newUser = await prisma.user.create({ data: { name } });
    res.status(201).json(newUser);
  } catch (err) {
    console.error("Erro ao criar utilizador:", err);
    res.status(500).json({ error: "Erro ao criar utilizador" });
  }
});


app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        tests: true,
      },
    });
    res.json(users);
  } catch (err) {
    console.error("Erro ao buscar utilizadores:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});



// Example route to fetch all patients
app.get("/patients", async (req, res) => {
  try {
    const patients = await prisma.patient.findMany(); // Fetch all patients
    res.json(patients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Example route to get a specific patient by ID
app.get("/patients/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
    });
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    res.json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.get("/api/ping", (req, res) => {
    res.json({ message: "pong" });
  });
  

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
