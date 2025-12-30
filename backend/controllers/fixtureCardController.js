import { getFixturesGroupedByLeague, getLiveFixtures } from "../services/fixtureCardService.js";

export async function fetchFixtureCardsByDate(req, res) {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ error: "Date parameter is required (YYYY-MM-DD)" });
    }

    const fixtures = await getFixturesGroupedByLeague(date);

    // Calculate total leagues for statistics/meta
    const totalLeagues = fixtures.length;

    res.json({
      date,
      totalLeagues,
      fixtures
    });
  } catch (err) {
    console.error("❌ Error fetching fixture cards:", err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function fetchLiveFixtureCards(req, res) {
  try {
    const fixtures = await getLiveFixtures();

    // Calculate total leagues
    const totalLeagues = fixtures.length;

    // Since frontend expects 'date' in response for PredictionsList props, we can pass dummy date
    res.json({
      date: "live",
      totalLeagues,
      fixtures
    });
  } catch (err) {
    console.error("❌ Error fetching live fixtures:", err);
    res.status(500).json({ error: "Server error" });
  }
}
