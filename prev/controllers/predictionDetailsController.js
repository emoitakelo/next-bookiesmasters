import { getPredictionDetailsService } from "../services/predictionDetailsService.js";

/**
 * @desc   Get full prediction details for a specific fixture
 * @route  GET /api/predictions/details/:fixtureId
 * @access Public
 */
export const getPredictionDetails = async (req, res) => {
  try {
    let { fixtureId } = req.params;

    if (!fixtureId) {
      return res.status(400).json({ success: false, message: "Fixture ID is required" });
    }

    // 🧠 Ensure fixtureId type matches your DB field (number)
    // If your fixture.id is stored as a number, convert it:
    if (!isNaN(fixtureId)) {
      fixtureId = Number(fixtureId);
    }

    const details = await getPredictionDetailsService(fixtureId);

    if (!details) {
      return res.status(404).json({ success: false, message: "Prediction details not found" });
    }

    res.status(200).json({ success: true, data: details });
  } catch (error) {
    console.error("❌ Error in getPredictionDetailsController:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
