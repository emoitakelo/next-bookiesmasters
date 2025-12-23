import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Fixture from "../models/Fixture.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

async function deepDebug() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Find a Premier League match (ID 39) to check events
        // Let's search by league ID
        const sample = await Fixture.findOne({
            "fixture.league.id": 39,
            "fixture.fixture.status.short": "FT"
        }).lean();

        if (!sample) {
            console.log("Could not find any fixture for Birmingham.");
            return;
        }

        const home = sample.fixture.teams.home;
        const away = sample.fixture.teams.away;
        const targetId = home.name === "Birmingham" ? home.id : away.id; // Just using logic to compile, but logic below relies on actual match data

        console.log(`Found Premier League Match: ${sample.fixture.teams.home.name} vs ${sample.fixture.teams.away.name} (ID: ${sample.fixtureId})`);

        const events = sample.fixture.events;
        console.log(`Has 'events' property: ${!!events}`);
        if (events) {
            console.log(`Events count: ${events.length}`);
            if (events.length > 0) {
                console.log("Sample Event:", JSON.stringify(events[0], null, 2));
            }
        }

        console.log(`Found Team ID for ${teamName}: ${targetId} (from fixture ${sample.fixtureId})`);

        // 2. Count ALL matches involving this ID, regardless of status
        const allMatches = await Fixture.find({
            $or: [
                { "fixture.teams.home.id": targetId },
                { "fixture.teams.away.id": targetId }
            ]
        }).select("fixture.fixture.status fixture.fixture.date fixture.teams").lean();

        console.log(`\nTotal matches found in DB for ID ${targetId}: ${allMatches.length}`);

        // 3. Breakdown by status
        const statusCounts = {};
        allMatches.forEach(m => {
            const s = m.fixture.fixture.status.short;
            statusCounts[s] = (statusCounts[s] || 0) + 1;
        });
        console.log("Status Breakdown:", statusCounts);

        // 4. List the dates of FT matches (to see if they are recent or old)
        const ftMatches = allMatches.filter(m => m.fixture.fixture.status.short === "FT");
        console.log("\nCompleted (FT) Matches Dates:");
        ftMatches.sort((a, b) => new Date(b.fixture.fixture.date) - new Date(a.fixture.fixture.date));
        ftMatches.slice(0, 10).forEach(m => console.log(`- ${m.fixture.fixture.date} (${m.fixture.fixture.status.short})`));

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

deepDebug();
