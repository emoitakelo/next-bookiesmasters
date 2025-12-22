
import Fixture from "../models/Fixture.js";
import Standing from "../models/Standing.js";
import { calculateTeamForm } from "../helpers/formCalculator.js";

export const getFixtureById = async (fixtureId) => {
    try {
        const fixtureIdNum = Number(fixtureId);

        // Find custom Fixture document
        const fixtureDoc = await Fixture.findOne({
            $or: [
                { fixtureId: fixtureIdNum },
                { "fixture.fixture.id": fixtureIdNum },
            ],
        }).lean();

        if (!fixtureDoc) {
            return null;
        }

        const matchData = fixtureDoc.fixture;
        const predictionData = fixtureDoc.prediction; // Embedded prediction

        // Use the root 'h2h' field as requested, which stores the H2H data from API
        const h2hData = fixtureDoc.h2h || [];

        // Calculate Form for Home/Away
        const homeData = await calculateTeamForm(matchData.teams.home.id);
        const awayData = await calculateTeamForm(matchData.teams.away.id);

        // Prepare Response Object matching frontend expectations
        // Logic adapted from prev/helpers/predictionMerger.js

        const isFinished = matchData.fixture.status.short === "FT";

        const displayDate = isFinished
            ? "FT"
            : new Date(matchData.fixture.date).toLocaleString("en-GB", {
                weekday: "short",
                hour: "2-digit",
                minute: "2-digit",
            });

        const response = {
            fixtureId: matchData.fixture.id,
            league: matchData.league.name,
            leagueLogo: matchData.league.logo,
            date: matchData.fixture.date,
            displayDate,
            status: matchData.fixture.status.short || "NS",
            venue: matchData.fixture.venue?.name || "Unknown venue",

            // Predictions (optional, kept if needed later or for reference)
            tip: predictionData?.predictions?.advice || "N/A",

            homeTeam: {
                id: matchData.teams.home.id,
                name: matchData.teams.home.name,
                logo: matchData.teams.home.logo,
                form: homeData.form,
                last5Matches: homeData.last5Matches,
            },

            awayTeam: {
                id: matchData.teams.away.id,
                name: matchData.teams.away.name,
                logo: matchData.teams.away.logo,
                form: awayData.form,
                last5Matches: awayData.last5Matches,
            },

            h2h: h2hData,
        };

        // Fetch Standings
        const standingsDoc = await Standing.findOne({
            "league.id": matchData.league.id,
            "league.season": matchData.league.season
        }).lean();

        // Add standings to response
        response.standings = standingsDoc ? standingsDoc.standings : [];

        return response;

    } catch (error) {
        console.error("Error in getFixtureById:", error);
        throw error;
    }
};
