import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function restoreFixture(fixtureId) {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const API_KEY = process.env.API_KEY;
        const BASE_URL = "https://v3.football.api-sports.io";

        console.log(`fetching fixture ${fixtureId} from API...`);
        const res = await axios.get(`${BASE_URL}/fixtures`, {
            params: { id: fixtureId },
            headers: { "x-apisports-key": API_KEY }
        });

        if (res.data.response && res.data.response.length > 0) {
            const freshData = res.data.response[0];
            console.log("API Events Count:", freshData.events.length);

            if (freshData.events.length > 0) {
                // Manually update DB
                await Fixture.updateOne(
                    { fixtureId: Number(fixtureId) },
                    {
                        $set: {
                            "fixture.events": freshData.events,
                            "fixture.fixture": freshData.fixture,
                            "fixture.score": freshData.score,
                            "fixture.goals": freshData.goals,
                            "fixture.status": freshData.fixture.status,
                        }
                    }
                );
                console.log("✅ RESTORED EVENTS TO DB!");
            } else {
                console.log("❌ API returned 0 events too. Maybe data is genuinely missing?");
            }

        } else {
            console.log("❌ Fixture not found in API.");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

restoreFixture(1469560);
