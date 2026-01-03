import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function findMatch() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const doc = await mongoose.connection.collection("fixtures").findOne({ "fixture.events.0": { $exists: true } });

    if (doc) {
        console.log("✅ Found fixture with events!");
        console.log("FixtureID:", doc.fixtureId);
        console.log("Events Count:", doc.fixture.events.length);
    } else {
        console.log("❌ No fixtures with events found in DB.");
    }
    process.exit(0);
}

findMatch();
