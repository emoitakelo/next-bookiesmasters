
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixture.js";
import { fetchLineups } from "./services/enrichmentService.js";

dotenv.config();

async function debugMatch() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find by team name regex
        const match = await Fixture.findOne({
            $or: [
                { "fixture.teams.home.name": /Wanderers/i },
                { "fixture.teams.away.name": /Wanderers/i }
            ],
            "fixture.teams.away.name": /Macarthur/i
        });

        if (!match) {
            console.log("❌ Match 'Western Sydney Wanderers vs Macarthur' NOT FOUND in DB.");
            return;
        }

        console.log(`✅ Found Match: ${match.fixture.teams.home.name} vs ${match.fixture.teams.away.name}`);
        console.log(`   ID: ${match.fixtureId}`);
        console.log(`   Status: ${match.fixture.fixture.status.short} (${match.fixture.fixture.status.elapsed}')`);
        console.log(`   Date: ${match.fixture.fixture.date}`);
        console.log(`   Lineups in DB:`, match.lineups ? `${match.lineups.length} entries` : "NULL/Undefined");

        // allow manual check of API
        console.log("\n📡 Manually fetching lineups from API...");
        const apiLineups = await fetchLineups(match.fixtureId);
        console.log(`   API Returned: ${apiLineups.length} lineups.`);
        if (apiLineups.length > 0) {
            console.log("   (API has data, so polling SHOULD work if conditions met)");
        } else {
            console.log("   (API also has NO data. This is an API availability issue, not code.)");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

debugMatch();
