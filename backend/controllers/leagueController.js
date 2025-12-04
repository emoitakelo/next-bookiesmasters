// controllers/leagueController.js
import League from "../models/League.js";

export async function getLeagues(req, res) {
  try {
    const leagues = await League.find({}, { "league.name": 1, "league.id": 1, _id: 0 }).lean();
    res.json({ total: leagues.length, leagues });
  } catch (err) {
    console.error("❌ Error fetching leagues:", err);
    res.status(500).json({ error: "Server error" });
  }
}
