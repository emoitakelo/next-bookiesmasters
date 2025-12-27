import axios from "axios";
import Fixture from "../models/Fixture.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

export async function pollLiveOdds() {
    try {
        // 1. Fetch ALL live odds globally (Cost: 1 API Call)
        // This endpoint returns odds for ALL currently in-play matches
        const response = await axios.get(`${BASE_URL}/odds/live`, {
            headers: { "x-apisports-key": API_KEY }
        });

        const oddsList = response.data.response;

        if (!oddsList || oddsList.length === 0) return;

        // 2. Bulk Update in MongoDB
        const bulkOps = oddsList.map(item => ({
            updateOne: {
                filter: { fixtureId: item.fixture.id },
                update: {
                    $set: {
                        // We store live odds in a specific field to separate from pre-match
                        "liveOdds": item.odds,
                        lastLiveUpdate: new Date()
                    }
                }
            }
        }));

        if (bulkOps.length > 0) {
            await Fixture.bulkWrite(bulkOps, { ordered: false });
            // console.log(`   🎲 Updated Live Odds for ${bulkOps.length} matches.`);
        }

    } catch (err) {
        // Suppress 404s or empty (ofter happens if no live odds available)
        // console.error("❌ [LiveOdds] Error:", err.message);
    }
}

export function startLiveOddsService() {
    console.log("🚀 Live Odds Service Started (Polling every 15s)");

    pollLiveOdds();
    setInterval(pollLiveOdds, 15000);
}
