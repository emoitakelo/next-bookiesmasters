import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Models
import TopScorer from "../models/TopScorer.js";
import League from "../models/League.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const api = axios.create({
    baseURL: "https://v3.football.api-sports.io",
    headers: {
        "x-apisports-key": process.env.API_KEY
    }
});

// Top 6 Leagues (IDs from API-Football)
const TARGET_LEAGUES = [39, 140, 78, 135, 61, 2];

async function fetchTopScorersForLeague(leagueId, season) {
    try {
        console.log(`fetching scorers for League ${leagueId}, Season ${season}...`);

        const res = await api.get("/players/topscorers", {
            params: { league: leagueId, season: season }
        });

        const players = res.data.response;

        if (!players || players.length === 0) {
            console.log(`   ⚠️ No scorers found for League ${leagueId}`);
            return null;
        }

        // Transform data to match Schema
        const formattedPlayers = players.map((p, index) => ({
            rank: index + 1,
            player: {
                id: p.player.id,
                name: p.player.name,
                firstname: p.player.firstname,
                lastname: p.player.lastname,
                age: p.player.age,
                nationality: p.player.nationality,
                photo: p.player.photo
            },
            team: {
                id: p.statistics[0].team.id,
                name: p.statistics[0].team.name,
                logo: p.statistics[0].team.logo
            },
            statistics: {
                goals: {
                    total: p.statistics[0].goals.total || 0,
                    assists: p.statistics[0].goals.assists || 0,
                    conceded: p.statistics[0].goals.conceded || 0,
                    saves: p.statistics[0].goals.saves || 0
                },
                games: {
                    appearences: p.statistics[0].games.appearences || 0,
                    minutes: p.statistics[0].games.minutes || 0,
                    rating: p.statistics[0].games.rating
                }
            }
        }));

        // Upsert to DB
        await TopScorer.findOneAndUpdate(
            { "league.id": leagueId, "league.season": season },
            {
                league: {
                    id: leagueId,
                    name: players[0].statistics[0].league.name, // Get name from response
                    season: season,
                    logo: players[0].statistics[0].league.logo,
                    flag: players[0].statistics[0].league.flag
                },
                players: formattedPlayers,
                updatedAt: new Date()
            },
            { upsert: true }
        );

        console.log(`   ✅ Saved ${formattedPlayers.length} scorers for ${players[0].statistics[0].league.name}`);

    } catch (err) {
        console.error(`   ❌ Error fetching League ${leagueId}:`, err.message);
    }
}

export async function run() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB Connected");

        // Fetch ALL leagues from DB
        const allLeagues = await League.find({});
        console.log(`Found ${allLeagues.length} leagues in DB. Fetching top scorers for all...`);

        for (const leagueDoc of allLeagues) {
            const id = leagueDoc.league.id;
            let season = 2024; // Default fallback

            if (leagueDoc.season) {
                season = leagueDoc.season;
            } else if (leagueDoc.league.season) {
                season = leagueDoc.league.season;
            }

            await fetchTopScorersForLeague(id, season);

            // tiny delay to be polite to API
            await new Promise(r => setTimeout(r, 200));
        }

        console.log("🎉 All Top Scorers fetched.");
        process.exit(0);

    } catch (err) {
        console.error("FATAL ERROR:", err);
        process.exit(1);
    }
}

// Allow standalone execution
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    run();
}
