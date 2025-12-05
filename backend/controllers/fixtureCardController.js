import { getFixturesGroupedByLeague } from "../services/fixtureCardService.js";

export async function fetchFixtureCardsByDate(req, res) {
  try {
    let { date } = req.query;

    // Always use Kenya timezone if date not provided
    if (!date) {
      const kenyaNow = new Date().toLocaleString("en-CA", { timeZone: "Africa/Nairobi" });
      date = kenyaNow.split(",")[0]; // "YYYY-MM-DD"
    }

    const data = await getFixturesGroupedByLeague(date);

    // Convert all fixture times to Kenya timezone
    data.forEach(leagueGroup => {
      leagueGroup.matches.forEach(match => {
        if (match.fixture && match.fixture.date) {
          // Original fixture date might be UTC ISO string
          const utcDate = new Date(match.fixture.date);

          // Convert to Kenya timezone by formatting with toLocaleString
          const kenyaDateStr = utcDate.toLocaleString("en-US", { timeZone: "Africa/Nairobi" });

          // Create new Date object in Kenya time and convert back to ISO
          match.fixture.date = new Date(kenyaDateStr).toISOString();
        }
      });
    });

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
