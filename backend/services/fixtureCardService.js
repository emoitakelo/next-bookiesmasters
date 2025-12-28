import Fixture from "../models/Fixture.js";
import { formatFixtureCard } from "../helpers/fixtureFormatter.js";

export async function getFixturesGroupedByLeague(date) {
  if (!date) throw new Error("Date parameter is required");

  // 1. Calculate Kenya Start & End of Day in UTC
  // Kenya is UTC+3.
  // "2025-12-27 00:00:00" Kenya = "2025-12-26 21:00:00" UTC
  // "2025-12-27 23:59:59" Kenya = "2025-12-27 20:59:59" UTC

  // We can use standard Date logic by forcing the time string parsing

  const startOfDayKenya = new Date(`${date}T00:00:00+03:00`);
  const endOfDayKenya = new Date(`${date}T23:59:59.999+03:00`);

  // Convert to native Date objects (which is what Mongoose queries against)
  // Note: Mongoose stores dates as UTC dates.

  const matchFilter = {
    "fixture.fixture.date": {
      $gte: startOfDayKenya.toISOString(),
      $lte: endOfDayKenya.toISOString()
    },
    // 🔥 OPTIMIZATION: Only fetch matches with odds
    // This filters out thousands of obscure youth/amateur games at the DB level
    "odds": { $exists: true, $not: { $size: 0 } }
  };

  // Fetch all fixtures for the date
  console.time("DB:FetchFixtures");
  const fixtures = await Fixture.find(matchFilter)
    .select({
      "fixture.id": 1,
      "fixture.name": 1,
      "fixture.logo": 1,
      "fixture.country": 1,
      "fixture.fixture": 1, // time, status, id
      "fixture.league": 1,
      "fixture.teams": 1,
      "fixture.goals": 1,
      "fixture.score": 1,
      "fixture.score": 1,
      // "fixture.events": 1, // ❌ REMOVED: Not needed for card, saves massive space
      "fixture.status": 1, // important for sort/filter
      "odds": { $slice: 1 }, // 🔥 OPTIMIZATION: Only fetch 1st bookmaker (saves ~90% of odds size)
      "liveOdds": 1, // live odds
      "livescore": 1, // our specific live data field
      "fixtureId": 1 // legacy id
    })
    .sort({ "fixture.league.id": 1, "fixture.fixture.date": 1 }) // sort by date string (ISO) works chronologically
    .lean();
  console.timeEnd("DB:FetchFixtures");

  // Filter out fixtures that **do not have match winner odds**
  // Filter is now done in MongoDB query for performance
  const fixturesWithOdds = fixtures;

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
