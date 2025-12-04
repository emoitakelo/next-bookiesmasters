import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";

import League from "../models/League.js";       // saved leagues
import Fixture from "../models/Fixture.js";     // your unified fixture model

dotenv.config();

/* ---------------------------------------------
   API BASE URL + HEADERS
--------------------------------------------- */
const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: {
    "x-apisports-key": process.env.API_KEY
  }
});

/* ---------------------------------------------
   FETCH SAVED LEAGUES FROM MONGO
--------------------------------------------- */
async function getSavedLeagues() {
  const leagues = await League.find({});
  return leagues.map(l => ({
    id: l.league.id,
    currentSeason: l.seasons?.find(s => s.current)?.year // adjust if you store season differently
  }));
}

/* ---------------------------------------------
   FETCH ALL FIXTURES FOR CURRENT SEASON
--------------------------------------------- */
async function fetchSeasonFixtures(leagueId, season) {
  try {
    const res = await api.get("/fixtures", {
      params: { league: leagueId, season }
    });
    return res.data?.response || [];
  } catch (err) {
    console.log(`⚠ Failed fetching fixtures for league ${leagueId}: ${err.message}`);
    return [];
  }
}

/* ---------------------------------------------
   MAIN SCRIPT
--------------------------------------------- */
export async function saveCurrentSeasonFixtures() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    const savedLeagues = await getSavedLeagues();
    if (!savedLeagues.length) {
      console.log("⚠ No saved leagues found in DB.");
      return;
    }

    for (const { id: leagueId, currentSeason } of savedLeagues) {
      if (!currentSeason) {
        console.log(`⚠ League ${leagueId} has no current season info, skipping.`);
        continue;
      }

      console.log(`📡 Fetching fixtures for league ${leagueId}, season ${currentSeason}...`);
      const fixtures = await fetchSeasonFixtures(leagueId, currentSeason);

      console.log(`📌 Found ${fixtures.length} fixtures for league ${leagueId}`);

      for (const f of fixtures) {
        const fixtureId = f.fixture.id;

        try {
          await Fixture.findOneAndUpdate(
            { fixtureId },
            {
              fixtureId,
              fixture: f,
              prediction: null,
              h2h: [],
              odds: []
            },
            { upsert: true }
          );
          console.log(`✔ Saved fixture ${fixtureId}`);
        } catch (err) {
          console.log(`❌ Failed saving fixture ${fixtureId}: ${err.message}`);
        }
      }
    }

    console.log("\n🎉 ALL CURRENT SEASON FIXTURES SAVED");

  } catch (err) {
    console.error("❌ ERROR:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

/* ---------------------------------------------
   RUN IF EXECUTED DIRECTLY
--------------------------------------------- */
if (process.argv[1].includes("seasonFixtures.js")) {
  saveCurrentSeasonFixtures();
}
