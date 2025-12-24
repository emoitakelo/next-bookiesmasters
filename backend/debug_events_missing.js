import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function inspectFixture() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const fixtureId = 1347247;
        const f = await Fixture.findOne({ fixtureId });

        if (!f) {
            console.log(`❌ Fixture ${fixtureId} NOT FOUND in DB.`);
        } else {
            console.log(`✅ Fixture ${fixtureId} Found.`);
            console.log(`   Teams: ${f.fixture.teams.home.name} vs ${f.fixture.teams.away.name}`);
            console.log("   --- Events Data ---");
            if (f.fixture.events && f.fixture.events.length > 0) {
                console.log(JSON.stringify(f.fixture.events, null, 2));
            } else {
                console.log("   ❌ Events array is EMPTY or UNDEFINED.");
                console.log("   f.fixture keys:", Object.keys(f.fixture));
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

inspectFixture();
