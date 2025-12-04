// liveScoreService.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Fixture from "../models/Fixture.js";

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
    console.log("♻️ Fetching live fixtures...");

    const { data } = await api.get("/fixtures", { params: { live: "all" } });
    const liveFixtures = data.response || [];
    const currentLiveIds = new Set(liveFixtures.map(f => f.fixture.id));

    // console.log(`📡 Live Matches from API: ${liveFixtures.length}`);
    // console.log("──────────────── LIVE MATCHES ────────────────");
    // liveFixtures.forEach(f => {
    //   console.log(`🔴 LIVE: ${f.teams.home.name} vs ${f.teams.away.name} (ID: ${f.fixture.id})`);
    // });
    // console.log("──────────────────────────────────────────");

    // 1️⃣ Update live scores
    const ops = liveFixtures.map(f => ({
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
        upsert: true,
      },
    }));

    if (ops.length) {
      await Fixture.bulkWrite(ops);
      console.log(`✅ Updated ${ops.length} live fixtures`);
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
