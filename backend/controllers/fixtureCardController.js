import { getFixturesGroupedByLeague } from "../services/fixtureCardService.js";

export async function fetchFixtureCardsByDate(req, res) {
  try {
    let { date } = req.query;

    // If no date is provided, always use Kenya timezone
    if (!date) {
      date = new Date().toLocaleDateString("en-CA", {
        timeZone: "Africa/Nairobi",
      });
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
