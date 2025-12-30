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

  // Fetch all fixtures for the date using Aggregation for Deep Filtering
  console.time("DB:FetchFixtures");
  const fixtures = await Fixture.aggregate([
    {
      $match: matchFilter
    },
    {
      $sort: { "fixture.league.id": 1, "fixture.fixture.date": 1 }
    },
    {
      $project: {
        "fixture.id": 1,
        "fixture.name": 1,
        "fixture.logo": 1,
        "fixture.country": 1,
        "fixture.fixture": 1,
        "fixture.league": 1,
        "fixture.teams": 1,
        "fixture.goals": 1,
        "fixture.score": 1,
        "fixture.status": 1,
        "liveOdds": 1,
        "livescore": 1,
        "fixtureId": 1,
        // 🔥 KEY OPTIMIZATION: Filter 'odds' array in-situ
        // We want odds[0].bets, filtered where name="Match Winner"
        "odds": {
          $map: {
            input: { $slice: ["$odds", 1] }, // Take 1st bookmaker
            as: "bookmaker",
            in: {
              id: "$$bookmaker.id",
              name: "$$bookmaker.name",
              logo: "$$bookmaker.logo",
              markets: {
                $filter: {
                  input: "$$bookmaker.markets", // Iterate over markets
                  as: "market",
                  cond: {
                    // Check specific name or ID (1=Match Winner)
                    $or: [
                      { $eq: ["$$market.name", "Match Winner"] },
                      { $eq: ["$$market.id", 1] }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  ]);
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
