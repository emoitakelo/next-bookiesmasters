// controllers/predictionController.js
import { getPredictionsByDateService } from "../services/predictionService.js";
import LiveScore from "../models/LiveScore.js";
import { mergeLiveScores } from "../helpers/mergeLiveScores.js";

export const getPredictionsByDate = async (req, res) => {
  try {
    const { date } = req.query;
    console.log("📅 Incoming /api/predictions request with date:", date);

    if (!date) {
      return res.status(400).json({ success: false, message: "Missing date query param" });
    }

    console.log("🧩 Step 1: Calling getPredictionsByDateService...");
    const merged = await getPredictionsByDateService(date);
    console.log("✅ Step 1 done: got merged data:", merged?.length || 0);

    console.log("🧩 Step 2: Fetching live scores from DB...");
    const liveScores = await LiveScore.find({});
    console.log("✅ Step 2 done: found live scores:", liveScores.length);

    console.log("🧩 Step 3: Merging predictions with live scores...");
    const mergedWithLive = mergeLiveScores(merged, liveScores);
    console.log("✅ Step 3 done: mergedWithLive length:", mergedWithLive.length);

    return res.status(200).json({
      success: true,
      count: mergedWithLive.length,
      data: mergedWithLive,
    });
  } catch (err) {
    console.error("❌ ERROR inside getPredictionsByDate:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch predictions by date",
      error: err.message,
    });
  }
};

