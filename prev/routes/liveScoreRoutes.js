// routes/liveScoreRoutes.js
import express from "express";
import { updateLiveScores, getLiveScores } from "../controllers/liveScoreController.js";

const router = express.Router();

router.get("/", getLiveScores);
router.get("/update", updateLiveScores);

export default router;
