import Fixture from "../models/Fixture.js";
import { formatFixtureCard } from "../helpers/fixtureFormatter.js";

export async function getFixturesGroupedByLeague(date) {
  if (!date) throw new Error("Date parameter is required");

  const matchFilter = {
    "fixture.fixture.date": { $regex: `^${date}` } // target ISO string starting with YYYY-MM-DD
  };

  // Fetch all fixtures for the date
  const fixtures = await Fixture.find(matchFilter)
    .sort({ "fixture.league.id": 1, "fixture.fixture.timestamp": 1 })
    .lean();

  // Filter out fixtures that **do not have match winner odds**
  const fixturesWithOdds = fixtures.filter(fxDoc => {
    if (!fxDoc.odds || fxDoc.odds.length === 0) return false;

    // Check if at least one bookmaker has Match Winner market
    return fxDoc.odds.some(bookmaker =>
      bookmaker.markets?.some(market =>
        market.name?.toLowerCase() === "match winner"
      )
    );
  });

  // Group by league
  const grouped = {};
  fixturesWithOdds.forEach(doc => {
    const league = doc.fixture.league;
    const leagueId = league.id;

    if (!grouped[leagueId]) {
      grouped[leagueId] = {
        league: {
          id: league.id,
          name: league.name,
          logo: league.logo,
          country: league.country
        },
        matches: []
      };
    }

    grouped[leagueId].matches.push(formatFixtureCard(doc));
  });

  return Object.values(grouped);
}
