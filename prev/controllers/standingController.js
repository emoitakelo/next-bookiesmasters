// controllers/standingController.js
import axios from "axios";
import dotenv from "dotenv";
import League from "../models/League.js";
import Standing from "../models/Standing.js";

dotenv.config();

export const fetchStandings = async (req, res) => {
  try {
    const leagues = await League.find();

    if (!leagues.length) {
      return res.status(404).json({ message: "No leagues found in DB" });
    }

    for (const league of leagues) {
      try {
        console.log(`➡️ Fetching standings for: ${league.league.name} (ID: ${league.league.id}, Season: ${league.season})`);

        const response = await axios.get("https://v3.football.api-sports.io/standings", {
          headers: {
            "x-apisports-key": process.env.API_KEY,
          },
          params: {
            league: league.league.id,
            season: league.season,
          },
        });

        const standings = response.data.response;

        if (!standings || standings.length === 0) {
          console.log(`⚠️ No standings returned for: ${league.league.name} (${league.league.id})`);
          continue;
        }

        for (const standing of standings) {
          await Standing.updateOne(
            { "league.id": standing.league.id, "league.season": standing.league.season },
            { $set: standing },
            { upsert: true }
          );
        }

        console.log(`✅ Standings saved for: ${league.league.name}`);
      } catch (err) {
        console.error(`❌ Error fetching standings for ${league.league?.name || "Unknown"} (ID: ${league.league?.id}):`, err.message);
      }
    }

    res.json({ message: "Standings fetch process completed. Check logs for details." });
  } catch (error) {
    console.error("❌ Controller error:", error.message);
    res.status(500).json({ error: "Failed to fetch standings" });
  }
};
