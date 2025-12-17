// routes/standingRoutes.js
import express from "express";
import { fetchStandings } from "../controllers/standingController.js";

const router = express.Router();

router.get("/fetch", fetchStandings);

export default router;
