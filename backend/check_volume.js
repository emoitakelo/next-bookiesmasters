import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") }); // .env is in backend/ root, same as this script? checking dir list...

async function checkVolume() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // User confirmed Jan 24, 2026.
        const START = new Date("2026-01-24T00:00:00.000Z");
        const END = new Date("2026-01-24T23:59:59.999Z");

        const count = await Fixture.countDocuments({
            "fixture.date": { $gte: START.toISOString(), $lte: END.toISOString() }
        });

        console.log(`\n📅 FIXTURE VOLUME CHECK for JAN 24, 2026`);
        console.log(`----------------------------------------`);
        console.log(`Total Matches Saved in DB: ${count}`);

        // Estimate concurrent overlaps
        // Usually matches are 2 hours long.
        // If we update individually: count * (120 mins / update_interval)

        console.log(`\n--- SCENARIO 1: Individual Polling (BAD) ---`);
        console.log(`If 100 people view 100 DIFFERENT matches: 100 * calls/min = disastrous.`);

        console.log(`\n--- SCENARIO 2: Global Polling (GOOD) ---`);
        console.log(`1 call every 60s fetching ALL live games = 1440 calls/day.`);
        console.log(`1 call for Odds per game? = ${count} calls if we fetch once.`);
        console.log(`Total capacity remaining: 75,000 - 1,440 = ~73,500 for other things.`);

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkVolume();
