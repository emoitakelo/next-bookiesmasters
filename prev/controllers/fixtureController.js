// fixtureController.js
import { getFixturesByDate } from "../services/predictionService.js";

export const getFixturesForDate = async (req, res) => {
  try {
    const { date } = req.params;
    console.log(`➡️ Request URL: GET /api/fixtures/${date}`);

    const fixtures = await getFixturesByDate(date);

    // Debug logs
    console.log("📦 Raw fixtures response type:", typeof fixtures);
    console.log("📦 Is array:", Array.isArray(fixtures));
    console.log("📦 Total fixtures returned:", fixtures?.length);

    if (Array.isArray(fixtures)) {
      const withPredictions = fixtures.filter(f => f.predictions);
      console.log("🎯 Fixtures that contain predictions:", withPredictions.length);

      if (withPredictions.length > 0) {
        console.log("🔍 Example fixture with prediction:", JSON.stringify(withPredictions[0], null, 2));
      } else {
        console.log("⚠️ No fixtures contained predictions");
      }
    } else {
      console.log("⚠️ Fixtures is not an array — something is wrong with merging or grouping logic.");
    }

    res.json(fixtures);
  } catch (error) {
    console.error("❌ Error fetching fixtures:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
