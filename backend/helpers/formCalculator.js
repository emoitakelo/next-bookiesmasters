
import Fixture from "../models/Fixture.js";

export const calculateTeamForm = async (teamId) => {
    // Queries adapted for nested 'fixture' object in current schema
    const fixtures = await Fixture.find({
        $or: [
            { "fixture.teams.home.id": teamId },
            { "fixture.teams.away.id": teamId },
        ],
        "fixture.fixture.status.short": "FT", // Only completed matches
    })
        .sort({ "fixture.fixture.date": -1 }) // Sort by nested date
        .limit(5);

    const form = [];
    const last5Matches = [];

    fixtures.forEach((doc) => {
        // Access nested data
        const match = doc.fixture;

        // In current schema, 'match' contains { fixture, league, teams, goals, score, ... }
        const isHome = match.teams.home.id === teamId;
        const teamGoals = isHome ? match.goals.home : match.goals.away;
        const oppGoals = isHome ? match.goals.away : match.goals.home;

        // Determine Result
        let result, color;
        if (teamGoals > oppGoals) {
            result = "W";
            color = "#16a34a"; // green-600
        } else if (teamGoals < oppGoals) {
            result = "L";
            color = "#dc2626"; // red-600
        } else {
            result = "D";
            color = "#f97316"; // orange-500
        }

        // Store result for form summary
        form.push({ result, color });

        // Store detailed last 5 match info
        last5Matches.push({
            date: match.fixture.date,
            homeTeam: {
                id: match.teams.home.id,
                name: match.teams.home.name,
                logo: match.teams.home.logo,
            },
            awayTeam: {
                id: match.teams.away.id,
                name: match.teams.away.name,
                logo: match.teams.away.logo,
            },
            score: {
                home: match.goals.home,
                away: match.goals.away,
            },
            venue: match.fixture?.venue?.name || "Unknown venue",
            result, // W/D/L from current team's perspective
            color,
        });
    });

    return { form, last5Matches };
};
