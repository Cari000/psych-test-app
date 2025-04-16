import express from "express";
import { PrismaClient } from './generated/prisma/index.js';
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(express.json());

// Health check
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// === USER ROUTES ===

app.post("/api/users", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Name is required" });

  try {
    const newUser = await prisma.user.create({ data: { name } });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ include: { tests: true } });
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
    console.error("Error fetching tests:", error);
    res.status(500).json({ error: "Failed to fetch tests for user" });
  }
});

app.post("/api/users/:userId/tests", async (req, res) => {
  const { userId } = req.params;
  const { type, answers, scores } = req.body;

  try {
    const test = await prisma.test.create({
      data: { type, answers, scores, userId },
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
    await prisma.test.deleteMany({ where: { userId } });
    await prisma.user.delete({ where: { id: userId } });
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Failed to delete user" });
  }
});


// Enable CORS for production
if (process.env.NODE_ENV === "production") {
  app.use(cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type,Authorization"
  }));
} else {
  app.use(cors());
}


// === FRONTEND STATIC SERVE (PRODUCTION ONLY) ===
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "../dist");
  app.use(express.static(distPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
