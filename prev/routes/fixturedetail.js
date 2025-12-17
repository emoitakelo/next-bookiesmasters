import express from "express";
import { getFixtureDetails } from "../controllers/fixturedetailController.js";

const router = express.Router();

router.get("/:id/details", getFixtureDetails);

export default router;
