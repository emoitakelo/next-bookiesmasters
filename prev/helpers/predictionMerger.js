// helpers/predictionMerger.js
export const mergePredictionDetails = ({ fixture, prediction, homeData, awayData }) => {
  const fixtureData = fixture.fixture;

  // Determine if match is finished
  const isFinished = fixtureData.status?.short === "FT";

  // Format displayDate
  const displayDate = isFinished
    ? "FT"
    : new Date(fixtureData.date).toLocaleString("en-GB", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      });

  return {
    fixtureId: fixtureData.id,
    league: prediction.league?.name || fixture.league?.name,
    leagueLogo: prediction.league?.logo || fixture.league?.logo,
    date: fixtureData.date,
    displayDate,          // ← new formatted property
    status: fixtureData.status?.short || "NS", // ← new status property
    tip: prediction.predictions?.advice || "N/A",
    venue: fixtureData?.venue?.name || "Unknown venue",

    homeTeam: {
      id: fixture.teams.home.id,
      name: fixture.teams.home.name,
      logo: fixture.teams.home.logo,
      form: homeData.form,
      last5Matches: homeData.last5Matches,
    },

    awayTeam: {
      id: fixture.teams.away.id,
      name: fixture.teams.away.name,
      logo: fixture.teams.away.logo,
      form: awayData.form,
      last5Matches: awayData.last5Matches,
    },

    h2h: prediction.h2h || [],
  };
};
