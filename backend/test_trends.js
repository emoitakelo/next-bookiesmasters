import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";
import { calculateTeamForm } from "./helpers/formCalculator.js";
import { calculateTrends } from "./helpers/trendCalculator.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function testTrends(fixtureId) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const doc = await Fixture.findOne({ fixtureId: Number(fixtureId) }).lean();
        if (!doc) {
            console.log("❌ Fixture not found");
            process.exit(1);
        }

        console.log(`Analyzing: ${doc.fixture.teams.home.name} vs ${doc.fixture.teams.away.name}`);

        // Fetch form data like fixtureService does
        const homeData = await calculateTeamForm(doc.fixture.teams.home.id);
        const awayData = await calculateTeamForm(doc.fixture.teams.away.id);

        if (!homeData || !awayData) {
            console.log("❌ Could not calculate form data.");
            process.exit(1);
        }

        console.log("Home Last 5 Count:", homeData.last5Matches.length);
        if (homeData.last5Matches.length > 0) {
            console.log("Sample Match Structure:", JSON.stringify(homeData.last5Matches[0], null, 2));
        }
        console.log("Away Last 5 Count:", awayData.last5Matches.length);
        console.log("H2H Count:", doc.h2h?.length || 0);

        const trends = calculateTrends(
            homeData.last5Matches,
            awayData.last5Matches,
            doc.h2h,
            doc.fixture.teams.home.name,
            doc.fixture.teams.away.name
        );

        console.log("\n--- TRENDS RESULT ---");
        console.log(JSON.stringify(trends, null, 2));

        process.exit(0);

    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

testTrends(1469560);
