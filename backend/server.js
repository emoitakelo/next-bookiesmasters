// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";         // ⭐ IMPORTANT
import fixtureRoutes from "./routes/fixtureRoutes.js";
import "./services/live.js"; // <-- start live updates on server start

import leagueRoutes from "./routes/leagueRoutes.js";


dotenv.config();

const app = express();

// ⭐ Enable CORS for frontend
app.use(cors());

// Body parser
app.use(express.json());

const PORT = process.env.PORT || 5000;

// ---------------------------------------------
// MONGO CONNECTION
// ---------------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ---------------------------------------------
// ROUTES
// ---------------------------------------------
app.use("/api/fixtures", fixtureRoutes);
app.use("/api/leagues", leagueRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Backend running with CORS enabled");
});

// ---------------------------------------------
// START SERVER
// ---------------------------------------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
