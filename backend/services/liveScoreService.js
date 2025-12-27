import axios from "axios";
import Fixture from "../models/Fixture.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

// Cache to prevent flood of logs
let lastLogTime = 0;

export async function pollLiveScores() {
    try {
        // 1. Fetch ALL live games globally (Cost: 1 API Call)
        const response = await axios.get(`${BASE_URL}/fixtures`, {
            params: { live: "all" },
            headers: { "x-apisports-key": API_KEY }
        });

        const liveFixtures = response.data.response;

        // Log only if we have active games, or periodically
        const now = Date.now();
        if (liveFixtures.length > 0 || now - lastLogTime > 60000 * 5) {
            console.log(`📡 [LivePoll] Found ${liveFixtures.length} active matches.`);
            lastLogTime = now;
        }

        if (!liveFixtures || liveFixtures.length === 0) return;

        // 2. Bulk Update in MongoDB
        // We iterate and update only if we have this match in our DB
        // Using bulkWrite for performance
        const bulkOps = liveFixtures.map(apiFixture => ({
            updateOne: {
                filter: { fixtureId: apiFixture.fixture.id },
                update: {
                    $set: {
                        "fixture.fixture": apiFixture.fixture, // time, status
                        "fixture.goals": apiFixture.goals,
                        "fixture.score": apiFixture.score,
                        "fixture.events": apiFixture.events,
                        "fixture.status": apiFixture.fixture.status,
                        // 🔥 POPULATE LIVESCORE FIELD (Preferred by Formatter)
                        livescore: {
                            status: apiFixture.fixture.status,
                            goals: apiFixture.goals,
                            score: apiFixture.score
                        },
                        lastLiveUpdate: new Date()
                    }
                }
            }
        }));

        if (bulkOps.length > 0) {
            const result = await Fixture.bulkWrite(bulkOps, { ordered: false });
            // console.log(`   📝 Updated ${result.modifiedCount} matches in DB.`);
        }

    } catch (err) {
        console.error("❌ [LivePoll] Error:", err.message);
    }
}

// Start the polling loop (runs every 60 seconds)
export function startLiveService() {
    console.log("🚀 Live Score Service Started (Polling every 60s)");

    // Run immediately on start
    pollLiveScores();

    // Then interval
    setInterval(pollLiveScores, 5000);
}
