import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Fixture from "../models/Fixture.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

async function deepDebug() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Find the specific match user mentioned
        const teamName = "Macarthur";
        console.log(`Searching for team: ${teamName}`);

        const sample = await Fixture.findOne({
            $or: [
                { "fixture.teams.home.name": { $regex: teamName, $options: "i" } },
                { "fixture.teams.away.name": { $regex: teamName, $options: "i" } }
            ]
        }).lean();

        if (!sample) {
            console.log("Could not find any fixture for Birmingham.");
            return;
        }

        const home = sample.fixture.teams.home;
        const away = sample.fixture.teams.away;
        const targetId = home.name === "Birmingham" ? home.id : away.id; // Just using logic to compile, but logic below relies on actual match data

        console.log(`Found Match: ${sample.fixture.teams.home.name} vs ${sample.fixture.teams.away.name} (ID: ${sample.fixtureId})`);

        console.log("\n--- LiveScore Data (from 'livescore' field) ---");
        if (sample.livescore) {
            console.log(JSON.stringify(sample.livescore, null, 2));
        } else {
            console.log("No 'livescore' field found.");
        }

        console.log("\n--- Fixture Events (from 'fixture.events' field) ---");
        const events = sample.fixture.events;
        console.log(`Has 'events' property: ${!!events}`);
        if (events) {
            console.log(`Events count: ${events.length}`);
            if (events.length > 0) {
                console.log("Events:", JSON.stringify(events, null, 2));
            }
        }

        // Return early for this specific debug
        process.exit(0);

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
