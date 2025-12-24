import Fixture from "../models/Fixture.js";

// @desc    Handle incoming webhook from API-Football
// @route   POST /api/webhooks/livescore
export const handleLiveScoreWebhook = async (req, res) => {
    try {
        const payload = req.body;

        // 1. Basic validation
        // API-Football usually sends an array of fixtures or a single object depending on configuration
        // We assume it sends the standard fixture object structure
        if (!payload || !payload.fixture) {
            console.log("⚠ Received invalid webhook payload:", payload);
            return res.status(400).json({ message: "Invalid payload" });
        }

        const fixtureId = payload.fixture.id;
        console.log(`📡 Webhook received for Fixture ${fixtureId} (${payload.teams?.home?.name} vs ${payload.teams?.away?.name})`);

        // 2. Upsert/Update the fixture in DB
        // We update the 'fixture' field which contains events, status, score etc.
        // We also update 'livescore' field if you use it separately, but 'fixture' object usually has everything.
        // Based on your model, you store the full payload in 'fixture'

        const updateData = {
            "fixture.fixture": payload.fixture, // Status, elapsed, etc.
            "fixture.goals": payload.goals,
            "fixture.score": payload.score,
            "fixture.events": payload.events,     // Cards, goals details
            "fixture.statistics": payload.statistics, // Live stats if enabled
            lastLiveUpdate: new Date()
        };

        const result = await Fixture.findOneAndUpdate(
            { fixtureId: fixtureId },
            { $set: updateData },
            { new: true }
        );

        if (result) {
            console.log(`   ✅ Database updated for Fixture ${fixtureId}`);
            res.status(200).json({ message: "Webhook processed", fixtureId });
        } else {
            console.log(`   ⚠ Fixture ${fixtureId} not found in DB. Skipping update.`);
            // You might want to upsert here if you want to add new live games automatically
            // For now, we only update existing ones to avoid junk data
            res.status(200).json({ message: "Fixture not found, skipped" });
        }

    } catch (err) {
        console.error("❌ Webhook Error:", err.message);
        res.status(500).json({ message: "Server Error" });
    }
};
