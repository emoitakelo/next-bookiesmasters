import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import Fixture from "../models/Fixture.js";
import { calculateTeamForm } from "../helpers/formCalculator.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

async function debugFixtureData() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Fetch a recent fixture
        const fixtureDoc = await Fixture.findOne().sort({ "fixture.fixture.date": -1 }).lean();

        if (!fixtureDoc) {
            console.log("No fixtures found.");
            return;
        }

        console.log(`\nAnalyzing Fixture ID: ${fixtureDoc.fixtureId}`);
        console.log(`Match: ${fixtureDoc.fixture.teams.home.name} vs ${fixtureDoc.fixture.teams.away.name}`);

        // Check Events
        // Note: In our storage, 'fixture' field holds the entire API response object
        // API-Football structure: res.response[0] = { fixture:..., league:..., teams:..., events:[...], ... }
        const storedObject = fixtureDoc.fixture;
        console.log(`\n--- Events Analysis ---`);
        console.log(`Has 'events' property: ${!!storedObject.events}`);
        if (storedObject.events) {
            console.log(`Events count: ${storedObject.events.length}`);
            if (storedObject.events.length > 0) {
                console.log("Sample Event:", JSON.stringify(storedObject.events[0], null, 2));
            }
        }

        if (fixtureDoc.prediction) {
            console.log(`Prediction object exists.`);
            console.log(`Prediction 'h2h' property length: ${fixtureDoc.prediction.h2h ? fixtureDoc.prediction.h2h.length : 0}`);

            if (fixtureDoc.prediction.h2h && fixtureDoc.prediction.h2h.length > 0) {
                console.log("Sample H2H item from prediction:", JSON.stringify(fixtureDoc.prediction.h2h[0], null, 2));
            }
            console.log("Prediction Keys:", Object.keys(fixtureDoc.prediction));
            if (fixtureDoc.prediction.teams) {
                console.log("Prediction Teams Keys:", Object.keys(fixtureDoc.prediction.teams));
                // dump home
                console.log("Prediction Home Team:", JSON.stringify(fixtureDoc.prediction.teams.home, null, 2));
            }
        } else {
            console.log("Prediction object is null.");
        }

        // Check Prediction Teams Last 5
        if (fixtureDoc.prediction && fixtureDoc.prediction.teams) {
            console.log(`\n--- Prediction Object 'teams' Analysis ---`);
            const homeLast5 = fixtureDoc.prediction.teams.home?.last_5;
            console.log(`Home Last 5 metadata exists: ${!!homeLast5}`);

            if (homeLast5) {
                // API-Football sometimes returns 'last_5' as an object with 'played', 'win', etc., 
                // OR sometimes it includes the actual list of matches in a different field like 'league.last_5' matches? 
                // Actually, API-Football Predictions endpoint structure is:
                // teams: { home: { last_5: { played: 5, form: "DWLWW", goals: ... } } }
                // It does NOT usually contain the full match *details* list in 'teams.home.last_5'.
                // However, the user said "extracted from the prediction object".
                // Let's verify exactly what is in there.
                console.log("Sample Home Last 5:", JSON.stringify(homeLast5, null, 2));
            }
        }
        // Check Form Logic
        console.log(`\n--- Form/Last 5 Matches Analysis ---`);
        const homeTeamId = fixtureDoc.fixture.teams.home.id;
        console.log(`Calculating form for Home Team: ${fixtureDoc.fixture.teams.home.name} (ID: ${homeTeamId}, Type: ${typeof homeTeamId})`);

        // Call the helper directly
        const homeFormData = await calculateTeamForm(homeTeamId);
        console.log(`Matches returned by calculateTeamForm: ${homeFormData.last5Matches.length}`);

        // Manual query with type check
        const matches = await Fixture.find({
            $or: [
                { "fixture.teams.home.id": homeTeamId },
                { "fixture.teams.away.id": homeTeamId },
            ],
            "fixture.fixture.status.short": "FT"
        }).limit(10).lean();

        console.log(`Manual Query Found: ${matches.length}`);
        matches.forEach(m => {
            const hId = m.fixture.teams.home.id;
            const aId = m.fixture.teams.away.id;
            console.log(`- Match ${m.fixtureId}: HomeID=${hId} (${typeof hId}), AwayID=${aId} (${typeof aId}), Status=${m.fixture.fixture.status.short}`);
        });

        // Total count in DB
        const totalDocs = await Fixture.countDocuments({});
        console.log(`Total Fixtures in DB: ${totalDocs}`);

        // Double check specific query count
        const actualCount = await Fixture.countDocuments({
            $or: [
                { "fixture.teams.home.id": homeTeamId },
                { "fixture.teams.away.id": homeTeamId },
            ],
            "fixture.fixture.status.short": "FT"
        });
        console.log(`Total completed matches in DB for this team: ${actualCount}`);


    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

debugFixtureData();
