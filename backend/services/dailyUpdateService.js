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
   UTIL: GET DATE + N DAYS (UTC)
--------------------------------------------- */
function getDatePlus(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + days);

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
   FETCH FIXTURES FOR MULTIPLE DATES
--------------------------------------------- */
async function fetchFixturesForDates(savedLeagueIds, daysAhead = 2) {
  let combined = [];

  for (let day = 0; day <= daysAhead; day++) {
    const date = getDatePlus(day);
    console.log(`📅 Fetching fixtures for ${date}`);

    const res = await api.get(`/fixtures`, {
      params: { date }
    });

    const fixtures = res.data.response || [];
    console.log(`   → Total fixtures on ${date}: ${fixtures.length}`);

    // filter by saved leagues
    const filtered = fixtures.filter(f =>
      savedLeagueIds.includes(f.league.id)
    );

    console.log(`   → Saved league fixtures on ${date}: ${filtered.length}\n`);

    combined = combined.concat(filtered);
  }

  return combined;
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
        bookmaker: 8   // Bet365
      }
    });

    const odds = res.data?.response?.[0];
    if (!odds || !odds.bookmakers) return [];

    return odds.bookmakers.map(b => ({
      bookmaker: b.name,
      markets: b.bets
        .filter(m => m.name === "Match Winner") // 🔥 FILTER: Only keep Match Winner
        .map(m => ({
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
    // MongoDB should already be connected by server.js
    console.log("📡 Updating fixtures from today up to +7 days...\n");

    // 1. Load saved leagues
    const savedLeagueIds = await getSavedLeagueIds();
    if (savedLeagueIds.length === 0) {
      console.log("⚠ No saved leagues found. Add leagues first.");
      return;
    }

    // 2. Fetch fixtures for multiple days
    const fixtures = await fetchFixturesForDates(savedLeagueIds, 7);

    if (fixtures.length === 0) {
      console.log("⚠ No fixtures found for saved leagues between today and +7 days.");
      return;
    }

    // 3. Process each fixture
    for (const f of fixtures) {
      const fixtureId = f.fixture.id;

      // 1️⃣ predictions
      const { prediction, h2h } = await fetchPrediction(fixtureId);

      // 2️⃣ odds
      const bets = await fetchOdds(fixtureId);

      // 3️⃣ save/update in Mongo
      await Fixture.findOneAndUpdate(
        { fixtureId: fixtureId },
        {
          fixtureId: fixtureId,
          fixture: f,
          prediction,
          h2h,
          odds: bets
        },
        { upsert: true }
      );

      // console.log(`✔ Saved fixture ${fixtureId}`);
    }

    console.log("\n🎉 FIXTURE UPDATE COMPLETED");

  } catch (err) {
    console.error("❌ ERROR UPDATING FIXTURES:", err);
  }
}

export function startDailyScheduler() {
  console.log("⏰ Daily Update Scheduler Started (Runs every 24h, first run in 5 mins)");

  // Delay the first run by 5 minutes to allow server startup/health-checks to pass
  setTimeout(() => {
    console.log("⏰ Starting initial Daily Update...");
    updateDailyFixtures();
  }, 5 * 60 * 1000);

  // Then schedule the daily interval
  setInterval(() => {
    updateDailyFixtures();
  }, 24 * 60 * 60 * 1000);
}

/* ---------------------------------------------
   RUN IF EXECUTED DIRECTLY
--------------------------------------------- */
if (process.argv[1].includes("dailyUpdateService.js")) {
  updateDailyFixtures();
}
