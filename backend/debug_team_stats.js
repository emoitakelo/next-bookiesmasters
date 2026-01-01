
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixture.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookiesmasters";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to Mongo");

        // Get a recent fixture to ensure we have valid league/season data
        const fixture = await Fixture.findOne({ "fixture.league.season": 2024 }).limit(1);

        if (!fixture) {
            console.log("No 2024 fixtures found.");
            return;
        }

        const leagueId = fixture.fixture.league.id;
        const season = fixture.fixture.league.season;
        const teamId = fixture.fixture.teams.home.id;

        console.log(`Testing stats for League ${leagueId}, Season ${season}, Team ${teamId} (${fixture.fixture.teams.home.name})`);

        const api = axios.create({
            baseURL: "https://v3.football.api-sports.io",
            headers: { "x-apisports-key": process.env.API_KEY }
        });

        try {
            const res = await api.get("/teams/statistics", {
                params: {
                    league: leagueId,
                    season: season,
                    team: teamId
                }
            });

            const stats = res.data.response;
            console.log("--- FULL RESP ---", JSON.stringify(res.data, null, 2));

            if (!stats || !stats.fixtures) {
                console.log("Stats unsupported for this league/team");
                return;
            }

            console.log("--- USEFUL STATS ---");
            console.log("Games Played:", stats.fixtures.played);

        } catch (apiErr) {
            console.error("API Error:", apiErr.response ? apiErr.response.data : apiErr.message);
        }

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
