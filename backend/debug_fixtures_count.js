
import mongoose from "mongoose";
import Fixture from "./models/Fixture.js";
import dotenv from "dotenv";
dotenv.config({ path: "./backend/.env" });

async function checkTodayFixtures() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const today = new Date().toISOString().split("T")[0]; // "2025-12-31"

        console.log(`Checking fixtures for date: ${today}`);

        // Count total fixtures
        const count = await Fixture.countDocuments({
            "fixture.fixture.date": { $regex: today }
        });

        console.log(`✅ Total fixtures found for ${today}: ${count}`);

        if (count > 0) {
            const sample = await Fixture.findOne({ "fixture.fixture.date": { $regex: today } });
            console.log("Sample Fixture Team:", sample.fixture.teams.home.name);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkTodayFixtures();
