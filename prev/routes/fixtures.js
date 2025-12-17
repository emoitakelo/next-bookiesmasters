import express from "express";
import { getFixturesForDate } from "../controllers/fixtureController.js";

const router = express.Router();

router.get("/:date", getFixturesForDate);

export default router;
