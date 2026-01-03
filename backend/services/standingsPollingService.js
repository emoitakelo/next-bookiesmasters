import Fixture from "../models/Fixture.js";
import { updateStandings } from "./fetch_standings.js";

// Polling interval: 15 minutes
const POLLING_INTERVAL = 60 * 60 * 1000;

export async function pollStandingsForActiveLeagues() {
    try {
        // console.log("🏆 Standings Poller: Checking for active leagues...");

        // Define "Active"
        // 1. Matches currently LIVE
        // 2. Matches finished in last 2 hours (to catch final table updates)
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);

        const LIVE_STATUSES = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE", "INT"];

        const activeFixtures = await Fixture.find({
            $or: [
                { "fixture.fixture.status.short": { $in: LIVE_STATUSES } },
                {
                    "fixture.fixture.status.short": { $in: ["FT", "AET", "PEN"] },
                    "fixture.fixture.date": { $gte: twoHoursAgo.toISOString() }
                }
            ]
        }).select("fixture.league.id");

        if (activeFixtures.length === 0) {
            // console.log("   ℹ No active matches found. Skipping standings update.");
            return;
        }

        // Extract unique League IDs
        const uniqueLeagueIds = [...new Set(activeFixtures.map(f => f.fixture.league.id))];

        console.log(`   🏆 Found active acticity in ${uniqueLeagueIds.length} leagues. Updating standings...`);

        // Call existing update logic, filtering by these IDs
        await updateStandings(false, uniqueLeagueIds);

    } catch (err) {
        console.error("❌ Standings Poller Error:", err.message);
    }
}

export function startStandingsPoller() {
    console.log(`🚀 Standings Poller Started (Every ${POLLING_INTERVAL / 60000} mins)`);

    // Initial check
    pollStandingsForActiveLeagues();

    setInterval(pollStandingsForActiveLeagues, POLLING_INTERVAL);
}
