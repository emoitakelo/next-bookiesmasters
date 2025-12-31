
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixture.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookiesmasters";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to Mongo");
        const LIVE_STATUSES = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"];

        // Count "Live" matches
        const liveCount = await Fixture.countDocuments({
            "fixture.fixture.status.short": { $in: LIVE_STATUSES }
        });

        console.log(`🔥 Matches marked as LIVE in DB: ${liveCount}`);

        // List valid live dates?
        if (liveCount > 0) {
            const sample = await Fixture.find({
                "fixture.fixture.status.short": { $in: LIVE_STATUSES }
            }).limit(5).select("fixture.fixture.date fixture.fixture.status fixture.teams");

            console.log("Sample Stuck Matches:", JSON.stringify(sample, null, 2));
        }

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
