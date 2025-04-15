import express from "express";
import { PrismaClient } from './generated/prisma/index.js';
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// User Routes
app.post("/api/users", async (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const newUser = await prisma.user.create({ 
      data: { name } 
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { tests: true }, 
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

app.get("/api/users/:userId/tests", async (req, res) => {
  const { userId } = req.params;

  try {
    const tests = await prisma.test.findMany({
      where: { userId },
      select: {
        id: true,
        type: true,
        createdAt: true,
        scores: true,
        answers: true,
      },
    });

    res.json(tests);
  } catch (error) {
    console.error("Error fetching tests for user:", error);
    res.status(500).json({ error: "Failed to fetch tests for user" });
  }
});


app.post('/api/users/:userId/tests', async (req, res) => {
  const { userId } = req.params;
  const { type, answers, scores } = req.body;

  try {
    const test = await prisma.test.create({
      data: {
        type,
        answers,
        scores,
        userId,
      },
    });

    res.status(201).json(test);
  } catch (error) {
    console.error("Error adding test:", error);
    res.status(500).json({ error: "Failed to add test" });
  }
});

app.delete("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // First delete all tests associated with the user
    await prisma.test.deleteMany({
      where: { userId }
    });

    // Then delete the user
    await prisma.user.delete({
      where: { id: userId }
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
