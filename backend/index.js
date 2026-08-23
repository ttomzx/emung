import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import storyRoutes from "./routes/storyRoutes.js";
import memoryRoutes from "./routes/memoryRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";
import { seedDatabase } from "./seed.js";
import Member from "./models/Member.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
  "https://emung.vercel.app",
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/memories", memoryRoutes);
app.use("/api/events", eventRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Emung Backend API", timestamp: new Date() });
});

// Start Server & Auto Seed if empty
const startServer = async () => {
  await connectDB();

  // Auto-seed if database is brand new
  const count = await Member.countDocuments();
  if (count === 0) {
    console.log("Empty database detected. Running initial seed...");
    await seedDatabase();
  }

  app.listen(PORT, () => {
    console.log(`🚀 Emung Backend Server running on http://localhost:${PORT}`);
  });
};

startServer();
