// liveScoreService.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Fixture from "../models/Fixture.js";
import League from "../models/League.js";

dotenv.config();

const LIVE_UPDATE_INTERVAL = 30 * 1000; // 30 seconds
const api = axios.create({
  baseURL: "https://v3.football.api-sports.io",
  headers: { "x-apisports-key": process.env.API_KEY },
});

let previousLiveIds = new Set();

async function fetchFullFixture(fixtureId) {
  try {
    const { data } = await api.get("/fixtures", { params: { id: fixtureId } });
    return data.response?.[0] || null;
  } catch (err) {
    console.error(`❌ Failed fetching full fixture ${fixtureId}:`, err.message);
    return null;
  }
}

async function updateLiveStatus() {
  try {
    console.log("♻️ Checking for active matches...");

    // 0️⃣ PRE-CHECK: Do we even have any matches that SHOULD be live right now?
    // We want to avoid API calls if no leagues we care about are playing.
    const now = new Date();
    const threeHoursAgo = new Date(now.getTime() - 3 * 60 * 60 * 1000);

    const activeMatchesCount = await Fixture.countDocuments({
      $or: [
        // Case A: Status says it IS live
        { "fixture.fixture.status.short": { $in: ["1H", "2H", "HT", "ET", "P", "BT", "LIVE"] } },

        // Case B: Status says 'NS' (Not Started) but start time was recent (e.g. started 10 mins ago)
        // or suspended/interrupted matches we want to keep checking
        {
          "fixture.fixture.status.short": { $in: ["NS", "INT", "SUSP"] },
          "fixture.fixture.date": { $gte: threeHoursAgo.toISOString(), $lte: now.toISOString() }
        }
      ]
    });

    if (activeMatchesCount === 0) {
      console.log("💤 No active matches expected. Sleeping (0 API calls).");
      return;
    }

    console.log(`🚀 Found ${activeMatchesCount} potential live matches. Polling API...`);

    const { data } = await api.get("/fixtures", { params: { live: "all" } });
    const liveFixtures = data.response || [];
    const currentLiveIds = new Set(liveFixtures.map(f => f.fixture.id));

    // console.log(`📡 Live Matches from API: ${liveFixtures.length}`);
    // console.log("──────────────── LIVE MATCHES ────────────────");
    // liveFixtures.forEach(f => {
    //   console.log(`🔴 LIVE: ${f.teams.home.name} vs ${f.teams.away.name} (ID: ${f.fixture.id})`);
    // });
    // console.log("──────────────────────────────────────────");

    // 0️⃣ Get Saved Leagues to avoid fetching data for random leagues
    const savedLeagues = await League.find({}).select("league.id");
    const savedLeagueIds = new Set(savedLeagues.map(l => l.league.id));

    // Filter: Only keep matches from our saved leagues
    const relevantLiveFixtures = liveFixtures.filter(f => savedLeagueIds.has(f.league.id));

    // console.log(`found ${liveFixtures.length} live matches, ${relevantLiveFixtures.length} are in our saved leagues.`);

    // 1️⃣ Fetch full details for EACH RELEVANT live match
    // OPTIMIZATION: Batch requests using 'ids' parameter (max 20 per call) to save quota
    if (relevantLiveFixtures.length > 0) {
      const liveCount = relevantLiveFixtures.length;
      console.log(`⚡ Fetching full details for ${liveCount} relevant live matches (batched)...`);

      const relevantIds = relevantLiveFixtures.map(f => f.fixture.id);
      const batches = [];

      // Chunk into groups of 20 (API limit)
      for (let i = 0; i < relevantIds.length; i += 20) {
        batches.push(relevantIds.slice(i, i + 20));
      }

      const fullLiveFixtures = [];

      for (const batch of batches) {
        try {
          // Fetch batch
          const idsStr = batch.join("-");
          const { data } = await api.get("/fixtures", { params: { ids: idsStr } });
          if (data.response) {
            fullLiveFixtures.push(...data.response);
          }
        } catch (err) {
          console.error(`❌ Batch fetch failed: ${err.message}`);
        }
      }

      const ops = fullLiveFixtures
        .filter(f => f) // remove nulls
        .map(f => ({
          updateOne: {
            filter: { fixtureId: f.fixture.id },
            update: {
              $set: {
                livescore: {
                  goals: f.goals,
                  score: f.score,
                  status: f.fixture.status,
                  events: f.events || [],
                },
                // Update full fixture to keep everything in sync (including stats/lineups if they change)
                fixture: f,
                "fixture.events": f.events || [],
                lastLiveUpdate: new Date(),
              },
            },
            upsert: true,
          },
        }));

      if (ops.length) {
        await Fixture.bulkWrite(ops);
        console.log(`✅ Updated ${ops.length} live fixtures with FULL details`);
      }
    } else {
      console.log("⚠️ No live fixtures to update");
    }

    // 2️⃣ Detect fixtures that just finished
    const finishedIds = [...previousLiveIds].filter(id => !currentLiveIds.has(id));
    if (finishedIds.length) {
      console.log(`⚡ Fetching full data for finished fixtures: ${finishedIds.join(", ")}`);
      // Fetch full fixtures in parallel
      const fullFixtures = await Promise.all(finishedIds.map(fetchFullFixture));

      const ftOps = fullFixtures
        .filter(f => f) // remove nulls
        .map(f => ({
          updateOne: {
            filter: { fixtureId: f.fixture.id, ftUpdated: { $ne: true } },
            update: {
              $set: {
                fixture: f,
                ftUpdated: true,
                lastLiveUpdate: new Date(),
              },
            },
          },
        }));

      if (ftOps.length) {
        await Fixture.bulkWrite(ftOps);
        console.log(`✅ Updated ${ftOps.length} finished fixtures with full data`);
      }
    }

    // 3️⃣ Save current live IDs for next run
    previousLiveIds = currentLiveIds;

  } catch (err) {
    console.error("❌ Live update failed:", err.message);
  }
}

// -----------------------------------------
// CONNECT TO DB AND RUN
// -----------------------------------------
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    updateLiveStatus(); // first run
    setInterval(updateLiveStatus, LIVE_UPDATE_INTERVAL); // repeat
  })
  .catch(err => console.error("❌ MongoDB Error:", err.message));

// Optional: disconnect gracefully on exit
process.on("SIGINT", async () => {
  console.log("🔌 Closing MongoDB connection...");
  await mongoose.disconnect();
  process.exit(0);
});
