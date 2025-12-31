
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixture.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookiesmasters";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to Mongo");
        const LIVE_STATUSES = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"];

        // 1. Identify "Stuck" matches
        // Any match marked as LIVE but with a date older than 4 hours ago is likely finished.
        const fourHoursAgo = new Date();
        fourHoursAgo.setHours(fourHoursAgo.getHours() - 4);

        console.log(`🧹 Cleaning up matches started before ${fourHoursAgo.toISOString()}`);

        const res = await Fixture.updateMany(
            {
                "fixture.fixture.status.short": { $in: LIVE_STATUSES },
                "fixture.fixture.date": { $lt: fourHoursAgo.toISOString() }
            },
            {
                $set: {
                    "fixture.fixture.status.long": "Match Finished (Forced Cleanup)",
                    "fixture.fixture.status.short": "FT",
                    "fixture.fixture.status.elapsed": 90,
                    "livescore": {
                        status: {
                            long: "Match Finished",
                            short: "FT",
                            elapsed: 90
                        },
                        goals: { home: null, away: null },
                        score: { halfttime: null, fulltime: null, extratime: null, penalty: null }
                    }
                }
            }
        );

        console.log(`✅ Fixed ${res.modifiedCount} stuck matches.`);

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
