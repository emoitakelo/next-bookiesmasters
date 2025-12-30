
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixture.js";

dotenv.config({ path: "./backend/.env" });

async function debugFixture() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ DB Connected");

        // Find by team name - Arema or Persita
        const fixture = await Fixture.findOne({
            $or: [
                { "fixture.teams.home.name": /Arema/i },
                { "fixture.teams.away.name": /Arema/i }
            ]
        });

        if (!fixture) {
            console.log("❌ Fixture not found.");
        } else {
            console.log("--- FIXTURE DATA ---");
            console.log("ID:", fixture.fixtureId);
            console.log("Status (Static):", fixture.fixture.status);
            console.log("Livescore Data:", fixture.livescore);
            console.log("Last Updated:", fixture.updatedAt);
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

debugFixture();
