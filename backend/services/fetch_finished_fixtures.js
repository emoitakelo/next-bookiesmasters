import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import League from "../models/League.js";
import Fixture from "../models/Fixture.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

const api = axios.create({
    baseURL: "https://v3.football.api-sports.io",
    headers: {
        "x-apisports-key": process.env.API_KEY
    }
});

async function getSavedLeagues() {
    // Based on fetchLeaguesWithPredictions.js, the schema seems to store 'season' at the root
    // doc = { league: {...}, country: {...}, season: 2024, coverage: {...} }
    const leagues = await League.find({});
    return leagues.map(l => ({
        id: l.league.id,
        name: l.league.name,
        currentSeason: l.season // Using the root 'season' field we saw earlier
    }));
}

async function fetchFinishedFixtures(leagueId, season) {
    try {
        console.log(`   → Requesting FT fixtures for League ${leagueId}, Season ${season}...`);
        const res = await api.get("/fixtures", {
            params: {
                league: leagueId,
                season: season,
                status: "FT" // Only Finished matches
            }
        });
        return res.data?.response || [];
    } catch (err) {
        console.log(`   ⚠ Failed fetching fixtures for league ${leagueId}: ${err.message}`);
        return [];
    }
}

export async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const savedLeagues = await getSavedLeagues();
        if (!savedLeagues.length) {
            console.log("⚠ No saved leagues found in DB.");
            return;
        }

        console.log(`Found ${savedLeagues.length} leagues to check.`);

        for (const l of savedLeagues) {
            if (!l.currentSeason) {
                console.log(`⚠ League ${l.name} (${l.id}) has no season info, skipping.`);
                continue;
            }

            console.log(`\nProcessing: ${l.name} (${l.id}) - Season ${l.currentSeason}`);

            const fixtures = await fetchFinishedFixtures(l.id, l.currentSeason);
            console.log(`   → Found ${fixtures.length} finished fixtures.`);

            for (const f of fixtures) {
                const fixtureId = f.fixture.id;

                // Upsert: Only set the fixture data, try NOT to overwrite existing prediction/h2h if they exist?
                // Actually, for old historical matches, we probably don't have prediction data anyway.
                // But to be safe, we will use $set for fixture data and $setOnInsert for others if needed.
                // Or just use findOneAndUpdate with upsert.

                await Fixture.updateOne(
                    { fixtureId: fixtureId },
                    {
                        $set: {
                            fixtureId: fixtureId,
                            fixture: f
                            // valid for history sorting
                        },
                        $setOnInsert: {
                            prediction: null,
                            h2h: [],
                            odds: [],
                            livescore: null
                        }
                    },
                    { upsert: true }
                );
            }
            console.log(`   ✔ Synced ${fixtures.length} matches.`);
        }

        console.log("\n🎉 Finished fetching historical data.");

    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
