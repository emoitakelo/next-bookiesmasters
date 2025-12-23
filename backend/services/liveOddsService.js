import mongoose from "mongoose";
import dotenv from "dotenv";
import axios from "axios";
import Fixture from "../models/Fixture.js";

import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

const UPDATE_INTERVAL = 60 * 1000; // 1 minute
const api = axios.create({
    baseURL: "https://v3.football.api-sports.io",
    headers: { "x-apisports-key": process.env.API_KEY },
});

async function updateLiveOdds() {
    try {
        // console.log("🎲 Polling API for Live Odds...");

        // 1. Get ALL live odds from API (Bulk)
        // This returns odds for ALL fixtures currently live on API-Football
        const { data } = await api.get("/odds/live", {
            params: {
                // bet: 1 // Removing bet filter to see IF we get ANY odds at all
                // Note: omitting bet returns all markets which is heavier but better for 'events'. 
                // Let's start with omitting to get full data, assuming we want to replicate 'odds' structure.
            }
        });

        const allLiveOdds = data.response || [];
        console.log(`📡 API returned ${allLiveOdds.length} live odds objects.`);

        if (allLiveOdds.length === 0) {
            console.log("💤 No live odds returned from API.");
            return;
        }

        // 2. Filter: Only update odds for fixtures WE HAVE in our database
        const liveIds = allLiveOdds.map(o => o.fixture.id);

        // Check which of these IDs exist in our DB
        const existingDocs = await Fixture.find({ fixtureId: { $in: liveIds } }).select("fixtureId");
        const existingIds = new Set(existingDocs.map(d => Number(d.fixtureId)));

        const relevantOdds = allLiveOdds.filter(o => existingIds.has(Number(o.fixture.id)));

        console.log(`🔍 Matches in DB: ${existingIds.size}. Live Odds matching DB: ${relevantOdds.length}`);

        if (relevantOdds.length === 0) {
            // console.log("ℹ️ Live odds found, but none match our saved fixtures.");
            return;
        }

        console.log(`🚀 Updating live odds for ${relevantOdds.length} fixtures...`);

        // 3. Bulk Update
        const updateIds = relevantOdds.map(o => o.fixture.id);
        console.log(`📝 IDs to update: ${updateIds.join(", ")}`);

        const ops = relevantOdds.map(o => ({
            updateOne: {
                filter: { fixtureId: Number(o.fixture.id) },
                update: {
                    $set: {
                        liveOdds: o.odds || [], // Save into dedicated field
                        lastLiveUpdate: new Date(),
                    },
                },
            },
        }));

        if (ops.length) {
            await Fixture.bulkWrite(ops);
            console.log(`✅ updated live odds.`);
        }

    } catch (err) {
        console.error("❌ Live odds update failed:", err.message);
    }
}

// -----------------------------------------
// CONNECT TO DB AND RUN
// -----------------------------------------
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ Connected to MongoDB (Live Odds Service)");
        updateLiveOdds(); // first run
        setInterval(updateLiveOdds, UPDATE_INTERVAL); // repeat
    })
    .catch(err => console.error("❌ MongoDB Error:", err.message));

process.on("SIGINT", async () => {
    console.log("🔌 Closing MongoDB connection...");
    await mongoose.disconnect();
    process.exit(0);
});
