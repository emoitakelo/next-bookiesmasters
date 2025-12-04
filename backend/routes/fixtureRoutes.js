// routes/fixtureRoutes.js
import express from "express";
import { fetchFixtureCardsByDate } from "../controllers/fixtureCardController.js";

const router = express.Router();

// public endpoint for homepage cards
router.get("/cards", fetchFixtureCardsByDate);

export default router;
