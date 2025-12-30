import { getFixturesGroupedByLeague, getLiveFixtures } from "../services/fixtureCardService.js";

export async function fetchFixtureCardsByDate(req, res) {
  try {
    const { date } = req.query;
    if (!date) {
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
