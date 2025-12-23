import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Fixture from "../models/Fixture.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Check for ANY fixture with liveOdds populated
        const withOdds = await Fixture.findOne({
            "liveOdds.0": { $exists: true }
        }).lean();

        if (withOdds) {
            console.log(`✅ Found fixture with liveOdds: ${withOdds.fixture.teams.home.name} vs ${withOdds.fixture.teams.away.name} (ID: ${withOdds.fixtureId})`);
            console.log(`Status: ${withOdds.fixture.fixture.status.short}`);
            console.log(`Live Odds Count: ${withOdds.liveOdds.length}`);
            console.log("Sample Market:", JSON.stringify(withOdds.liveOdds[0], null, 2));
        } else {
            console.log("❌ No fixtures found with 'liveOdds' populated.");
        }

        // 2. Check for a LIVE fixture to see what it has
        const liveMatch = await Fixture.findOne({
            "fixture.fixture.status.short": { $in: ["1H", "HT", "2H", "ET", "P", "LIVE"] }
        }).lean();

        if (liveMatch) {
            console.log(`\nFound LIVE match: ${liveMatch.fixture.teams.home.name} vs ${liveMatch.fixture.teams.away.name} (ID: ${liveMatch.fixtureId})`);
            console.log(`Status: ${liveMatch.fixture.fixture.status.short}`);
            console.log(`Live Odds Field:`, liveMatch.liveOdds ? `Exists (Length: ${liveMatch.liveOdds.length})` : "Does not exist/Null");
            console.log(`Pre-match Odds Field:`, liveMatch.odds ? `Exists (Length: ${liveMatch.odds.length})` : "Does not exist/Null");
        } else {
            console.log("\nNo matches currently marked as LIVE in key statuses.");
        }

        process.exit(0);

    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
}

run();
