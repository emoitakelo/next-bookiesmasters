import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Fixture from "../models/Fixture.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

async function deepDebug() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // 1. Find Birmingham's ID again (we saw 54 before)
        // Let's search by name to be sure we are looking at the right team
        const teamName = "Birmingham";
        console.log(`Searching for team: ${teamName}`);

        // Find ONE fixture with this team to get the ID
        const sample = await Fixture.findOne({
            $or: [
                { "fixture.teams.home.name": teamName },
                { "fixture.teams.away.name": teamName }
            ]
        }).lean();

        if (!sample) {
            console.log("Could not find any fixture for Birmingham.");
            return;
        }

        const home = sample.fixture.teams.home;
        const away = sample.fixture.teams.away;
        const targetId = home.name === teamName ? home.id : away.id;

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
