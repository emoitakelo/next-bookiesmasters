// controllers/liveScoreController.js
import { fetchAndUpdateLiveScores } from "../services/liveScoreService.js";
import LiveScore from "../models/LiveScore.js";

export const updateLiveScores = async (req, res) => {
  try {
    await fetchAndUpdateLiveScores();
    res.json({ success: true, message: "Live scores updated" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update live scores" });
  }
};

export const getLiveScores = async (req, res) => {
  try {
    const live = await LiveScore.find({});
    res.json({ success: true, count: live.length, data: live });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch live scores" });
  }
};
