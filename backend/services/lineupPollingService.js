import Fixture from "../models/Fixture.js";
import { fetchLineups } from "./enrichmentService.js";

// Configuration
const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutes
const LOOKAHEAD_MINUTES = 45; // Look for games starting in next 45 mins (User said 30, adding buffer)

export async function pollLineupsForUpcoming() {
    try {
        console.log("🕵️ Lineup Poller: Checking for upcoming matches...");

        const now = new Date();
        const lookahead = new Date(now.getTime() + LOOKAHEAD_MINUTES * 60000);

        // QUERY:
        // 1. Match Date is between NOW and NOW + 45s
        // 2. Lineups are EMPTY
        const query = {
            "fixture.fixture.date": {
                $gte: now.toISOString(),
                $lte: lookahead.toISOString()
            },
            $or: [
                { lineups: { $exists: false } },
                { lineups: { $size: 0 } },
                { lineups: null }
            ]
        };

        const targets = await Fixture.find(query).select("fixtureId fixture.fixture.date fixture.teams");

        if (targets.length === 0) {
            // console.log("   ✅ No pending lineups found.");
            return;
        }

        console.log(`   🎯 Found ${targets.length} matches expecting lineups. Fetching...`);

        // Process sequentially to be gentle on API
        for (const f of targets) {
            const lineups = await fetchLineups(f.fixtureId);

            if (lineups && lineups.length > 0) {
                await Fixture.updateOne(
                    { _id: f._id },
                    {
                        $set: { lineups: lineups },
                        $currentDate: { updatedAt: true }
                    }
                );
                console.log(`      ✅ Saved lineups for ${f.fixture.teams.home.name} vs ${f.fixture.teams.away.name}`);
            } else {
                console.log(`      ⚠️ No lineups yet for ${f.fixture.teams.home.name} vs ${f.fixture.teams.away.name}`);
            }
        }

    } catch (err) {
        console.error("❌ Lineup Poller Error:", err.message);
    }
}

export function startLineupPoller() {
    console.log(`🚀 Lineup Poller Started (Every ${POLLING_INTERVAL / 60000} mins)`);

    // Initial run
    pollLineupsForUpcoming();

    setInterval(pollLineupsForUpcoming, POLLING_INTERVAL);
}
