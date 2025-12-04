import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";

import League from "../models/League.js";       // your saved leagues
import Fixture from "../models/Fixture.js";     // unified fixture model

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
   GET TODAY DATE (UTC)
--------------------------------------------- */
function todayDate() {
  const d = new Date();
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/* ---------------------------------------------
   LOAD SAVED LEAGUES FROM MONGO
--------------------------------------------- */
async function getSavedLeagueIds() {
  const leagues = await League.find({});
  return leagues.map(l => l.league.id); // ensure this matches your schema
}

/* ---------------------------------------------
   FETCH TODAY'S FIXTURES FOR SAVED LEAGUES
--------------------------------------------- */
async function fetchTodayFixtures(savedLeagueIds) {
  const date = todayDate();

  const res = await api.get(`/fixtures`, {
    params: { date }
  });

  const allFixtures = res.data.response || [];
  console.log(`📌 All fixtures today: ${allFixtures.length}`);

  // filter by saved leagues
  const filtered = allFixtures.filter(f =>
    savedLeagueIds.includes(f.league.id)
  );

  console.log(`📌 Fixtures from saved leagues: ${filtered.length}\n`);

  return filtered;
}

/* ---------------------------------------------
   FETCH PREDICTIONS (ONLY prediction + h2h)
--------------------------------------------- */
async function fetchPrediction(fixtureId) {
  try {
    const res = await api.get(`/predictions`, {
      params: { fixture: fixtureId }
    });

    const data = res.data?.response?.[0];

    if (!data) return { prediction: null, h2h: null };

    return {
      prediction: data.predictions || null,
      h2h: data.h2h || null
    };

  } catch (err) {
    console.log(`⚠ Prediction not available for fixture ${fixtureId}: ${err.message}`);
    return { prediction: null, h2h: null };
  }
}

/* ---------------------------------------------
   FETCH ODDS (ONLY 1 BOOKMAKER)
--------------------------------------------- */
async function fetchOdds(fixtureId) {
  try {
    const res = await api.get(`/odds`, {
      params: {
        fixture: fixtureId,
        bookmaker: 8   // Bet365 (you can change)
      }
    });

    const odds = res.data?.response?.[0];
    if (!odds || !odds.bookmakers) return [];

    return odds.bookmakers.map(b => ({
      bookmaker: b.name,
      markets: b.bets.map(m => ({
        id: m.id,
        name: m.name,
        values: m.values.map(v => ({
          value: v.value,
          odd: v.odd
        }))
      }))
    }));

  } catch (err) {
    console.log(`⚠ Odds not available for fixture ${fixtureId}: ${err.message}`);
    return [];
  }
}

/* ---------------------------------------------
   MAIN: UPDATE DAILY FIXTURES
--------------------------------------------- */
export async function updateDailyFixtures() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB\n");

    console.log("📡 Updating today's fixtures...\n");

    // load saved leagues
    const savedLeagueIds = await getSavedLeagueIds();
    if (savedLeagueIds.length === 0) {
      console.log("⚠ No saved leagues found. Add leagues first.");
      return;
    }

    // fetch fixtures for today
    const fixtures = await fetchTodayFixtures(savedLeagueIds);

    if (fixtures.length === 0) {
      console.log("⚠ No fixtures today for saved leagues.");
      return;
    }

    // loop each fixture
    for (const f of fixtures) {
      const fixtureId = f.fixture.id;


//       console.log(`\n📌 Fixture ID: ${fixtureId}`);
//   console.log(Object.keys(f.fixture));


      // 1️⃣ predictions
      const { prediction, h2h } = await fetchPrediction(fixtureId);

      // 2️⃣ odds
      const bets = await fetchOdds(fixtureId);

      // 3️⃣ save/update
     await Fixture.findOneAndUpdate(
  { fixtureId: f.fixture.id },       // use top-level fixtureId
  {
    fixtureId: f.fixture.id,
    fixture: f,
    prediction,
    h2h,
    odds:bets
  },
  { upsert: true }
);



      console.log(`✔ Saved fixture ${fixtureId}`);
    }

    console.log("\n🎉 DAILY UPDATE COMPLETED");

  } catch (err) {
    console.error("❌ ERROR UPDATING DAILY FIXTURES:", err);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected");
  }
}

/* ---------------------------------------------
   RUN IF EXECUTED DIRECTLY
--------------------------------------------- */
if (process.argv[1].includes("dailyUpdateService.js")) {
  updateDailyFixtures();
}
