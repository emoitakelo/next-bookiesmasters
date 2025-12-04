// models/League.js
import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema({}, { strict: false });

/* ------------------------------------------
   🔥 IMPORTANT INDEXES FOR FAST LOOKUPS
-------------------------------------------*/

// 1️⃣ Index for League ID (API-Football main key)
leagueSchema.index({ "league.id": 1 }, { unique: true });

// 2️⃣ Index for League Name ("Premier League")
leagueSchema.index({ "league.name": 1 });

// 3️⃣ Index for Country ("England")
leagueSchema.index({ "country.name": 1 });

// 4️⃣ Index for Season (e.g., 2024, 2025)
leagueSchema.index({ season: 1 });

export default mongoose.models.League || mongoose.model("League", leagueSchema);
