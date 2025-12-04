import { getFixturesGroupedByLeague } from "../services/fixtureCardService.js";

export async function fetchFixtureCardsByDate(req, res) {
  try {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: "Missing date parameter" });
    }

    const data = await getFixturesGroupedByLeague(date);

    res.json({
      date,
      totalLeagues: data.length,
      fixtures: data
    });
  } catch (error) {
    console.error("❌ Error fetching fixtures by date:", error);
    res.status(500).json({ error: "Server error" });
  }
}
