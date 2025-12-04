// routes/leagueRoutes.js
import express from "express";
import { getLeagues } from "../controllers/leagueController.js";

const router = express.Router();

// GET /api/leagues
router.get("/", getLeagues);

export default router;
