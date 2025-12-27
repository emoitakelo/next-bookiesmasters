// liveScoreService.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Fixture from "../models/Fixture.js";
import League from "../models/League.js";

dotenv.config();

const LIVE_UPDATE_INTERVAL = 15 * 1000; // 30 seconds
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
    console.log("♻️  Polling API for Live Fixtures...");

    // 1. Get ALL live matches
    const { data } = await api.get("/fixtures", { params: { live: "all" } });
    const liveFixtures = data.response || [];

    if (liveFixtures.length === 0) {
      console.log("💤 No live matches currently.");
      return;
    }

    // 2. Filter: Only update fixtures that WE ALREADY HAVE in our database
    const liveIds = liveFixtures.map(f => f.fixture.id);

    // Check which of these IDs exist in our DB
    // We select _id too just to return objects, but we only need the fixtureId checks
    const existingDocs = await Fixture.find({ fixtureId: { $in: liveIds } }).select("fixtureId");
    const existingIds = new Set(existingDocs.map(d => d.fixtureId));

    const relevantFixtures = liveFixtures.filter(f => existingIds.has(f.fixture.id));

    if (relevantFixtures.length === 0) {
      // console.log("ℹ️ No live matches match our saved fixtures.");
      return;
    }

    console.log(`🚀 Updating ${relevantFixtures.length} live matches (out of ${liveFixtures.length} global)...`);

    // 3. Update Basic Livescore Data (Goals, Score, Status)
    const ops = relevantFixtures.map(f => ({
      updateOne: {
        filter: { fixtureId: f.fixture.id },
        update: {
          $set: {
            livescore: {
              goals: f.goals,
              score: f.score,
              status: f.fixture.status,
            },
            lastLiveUpdate: new Date(),
          },
        },
      },
    }));

    if (ops.length) {
      await Fixture.bulkWrite(ops);
      console.log(`✅ Updated ${ops.length} fixtures.`);
    }

    // 4. Handle Finished Matches
    // Use the relevant list to track completions
    const currentLiveIds = new Set(relevantFixtures.map(f => f.fixture.id));
    const finishedIds = [...previousLiveIds].filter(id => !currentLiveIds.has(id));

    if (finishedIds.length) {
      console.log(`🏁 Finalizing ${finishedIds.length} finished fixtures...`);
      const fullFixtures = await Promise.all(finishedIds.map(fetchFullFixture));

      const ftOps = fullFixtures
        .filter(f => f)
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
        console.log(`✅ Finalized ${ftOps.length} matches.`);
      }
    }

    // Save state for next run
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

process.on("SIGINT", async () => {
  console.log("🔌 Closing MongoDB connection...");
  await mongoose.disconnect();
  process.exit(0);
});
