import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getFixtureById } from "./services/fixtureService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function debugDetails() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const testId = "1387850"; // The KNOWN GOOD ID
        console.log(`🔍 Fetching details for ID: ${testId}`);

        const fixtureDoc = await mongoose.connection.collection("fixtures").findOne({ fixtureId: Number(testId) });
        console.log("Raw Doc Keys:", Object.keys(fixtureDoc || {}));
        console.log("Fixture Object Keys:", Object.keys(fixtureDoc?.fixture || {}));

        // Check if events allows exist in root
        if (fixtureDoc.events) console.log("FOUND EVENTS AT ROOT");
        if (fixtureDoc.fixture && fixtureDoc.fixture.events) console.log("FOUND EVENTS IN FIXTURE");

        const result = await getFixtureById(testId);

        if (!result) {
            console.error("❌ Result is NULL");
        } else {
            console.log("✅ Success! Result found.");
            console.log("Events:", JSON.stringify(result.events, null, 2));
            console.log("Home Team:", result.homeTeam);
            console.log("Away Team:", result.awayTeam);
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ EXCEPTION THROWN:", err);
        process.exit(1);
    }
}

debugDetails();
