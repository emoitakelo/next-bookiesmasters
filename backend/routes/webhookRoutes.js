import express from "express";
import { handleLiveScoreWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Define the webhook endpoint
router.post("/livescore", handleLiveScoreWebhook);

export default router;
