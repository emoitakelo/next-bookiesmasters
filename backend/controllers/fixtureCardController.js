import { getFixturesGroupedByLeague } from "../services/fixtureCardService.js";
import { utcToZonedTime, formatISO } from "date-fns-tz";

export async function fetchFixtureCardsByDate(req, res) {
  try {
    let { date } = req.query;

    // If no date is provided, always use Kenya timezone
    if (!date) {
      date = new Date().toLocaleDateString("en-CA", {
        timeZone: "Africa/Nairobi",
      });
    }

    // Fetch fixtures grouped by league
    const data = await getFixturesGroupedByLeague(date);

    // Convert all fixture times to Africa/Nairobi
    data.forEach(leagueGroup => {
      leagueGroup.matches.forEach(match => {
        if (match.fixture && match.fixture.date) {
          const kenyaTime = utcToZonedTime(match.fixture.date, "Africa/Nairobi");
          match.fixture.date = formatISO(kenyaTime); // ISO string with +03:00
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
