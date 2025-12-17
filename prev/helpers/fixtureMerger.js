// helpers/mergeFixturesPredictions.js

/**
 * Merges fixtures and predictions by fixtureId.
 * Includes team scores, formatted displayDate, and betting tip.
 */

import { calculateTip } from "./tipCalculator.js";
import { groupByLeague } from "./grouping.js";

export const mergeFixturesPredictions = (fixtures, predictions) => {
  const mergedData = [];

  fixtures.forEach((fixtureDoc) => {
    const fixture = fixtureDoc.fixture;
    const league = fixtureDoc.league;
    const teams = fixtureDoc.teams;

// Extract scores safely
    const homeScore = fixtureDoc?.score?.fulltime?.home ?? null;
    const awayScore = fixtureDoc?.score?.fulltime?.away ?? null;


    // Find matching prediction by fixtureId
    const prediction = predictions.find((p) => p.fixtureId === fixture.id);


    // console.log("DEBUG prediction for fixtureId", fixture.id, ":", prediction);

// console.log(
//   "DEBUG prediction sample for fixtureId:",
//   fixture.id,
//   JSON.stringify(prediction, null, 2)
// );


    // Skip if invalid or missing winner
   if (!prediction?.predictions?.winner?.name) {
  return;
}


    
    // Format displayDate:
    // - If FT → "FT"
    // - Else → show readable date + time
    const isFinished = fixture.status.short === "FT";
    const displayDate = isFinished
      ? "FT"
      : new Date(fixture.date).toLocaleString("en-GB", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        });

// Merge all data
// console.log("DEBUG prediction being passed to form helper:", JSON.stringify(prediction, null, 2));



    mergedData.push({
      fixtureId: fixture.id,
      league: league.name,
      leagueLogo: league.logo,
      country: league.country || "",
      countryLogo: league.flag || "",
      date: fixture.date,
      displayDate, // ← formatted for frontend
      status: fixture.status.short, // NS, FT, etc.
      homeTeam: {
        name: teams.home.name,
        logo: teams.home.logo,
        score: homeScore,
      },
      awayTeam: {
        name: teams.away.name,
        logo: teams.away.logo,
        score: awayScore,
      },


      
      tip: calculateTip(prediction, teams),
    });
    // console.log("📦 Merged fixture + prediction:", JSON.stringify(mergedData[mergedData.length - 1], null, 2));
  });

  const groupedData = groupByLeague(mergedData);


  return groupedData;
};
