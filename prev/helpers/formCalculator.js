// helpers/formCalculator.js
import Fixture from "../models/Fixture.js";

export const calculateTeamForm = async (teamId) => {
  const fixtures = await Fixture.find({
    $or: [
      { "teams.home.id": teamId },
      { "teams.away.id": teamId },
    ],
    "fixture.status.short": "FT", // Only completed matches
  })
    .sort({ "fixture.date": -1 })
    .limit(5);

  const form = [];
  const last5Matches = [];

  fixtures.forEach((match) => {
    const isHome = match.teams.home.id === teamId;
    const teamGoals = isHome ? match.goals.home : match.goals.away;
    const oppGoals = isHome ? match.goals.away : match.goals.home;
    const opponent = isHome ? match.teams.away : match.teams.home;

    let result, color;
    if (teamGoals > oppGoals) {
      result = "W";
      color = "#16a34a"; // Tailwind green-600
    } else if (teamGoals < oppGoals) {
      result = "L";
      color = "#dc2626"; // Tailwind red-600
    } else {
      result = "D";
      color = "#f97316"; // Tailwind orange-500
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
