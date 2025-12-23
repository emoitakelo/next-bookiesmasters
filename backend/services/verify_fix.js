import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Fixture from "../models/Fixture.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // ID from the recent successful log
        const testId = 1423225;
        console.log(`Checking fixture ${testId}...`);

        const doc = await Fixture.findOne({ fixtureId: testId }).lean();

        if (!doc) {
            console.log("❌ Fixture not found in DB.");
            process.exit(1);
        }

        const status = doc.fixture.fixture.status.short;
        const liveOdds = doc.liveOdds || [];
        const preMatchOdds = doc.odds || [];

        console.log(`Status: ${status}`);
        console.log(`Live Odds: ${liveOdds.length} entries`);
        console.log(`Prematch Odds: ${preMatchOdds.length} entries`);

        // Simulate Service Logic
        const shouldUseLiveOdds = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(status) && liveOdds.length > 0;

        if (shouldUseLiveOdds) {
            console.log("✅ RESULT: System WOULD display LIVE ODDS.");
            console.log("Sample:", JSON.stringify(liveOdds[0], null, 2));
        } else {
            console.log("⚠️ RESULT: System would display PREMATCH ODDS.");
            console.log(`Reason: Status '${status}' allowed? ${["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(status)}. Live odds > 0? ${liveOdds.length > 0}`);
        }

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

run();
