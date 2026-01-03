import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function findFixture() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    // Search for home or away team name containing "Melbourne City"
    const doc = await mongoose.connection.collection("fixtures").findOne({
        $or: [
            { "fixture.teams.home.name": /Melbourne City/i },
            { "fixture.teams.away.name": /Melbourne City/i }
        ]
    });

    if (doc) {
        console.log("✅ Found fixture!");
        console.log("ID:", doc.fixtureId);
        console.log("Home:", doc.fixture.teams.home.name);
        console.log("Away:", doc.fixture.teams.away.name);
        console.log("Events Count (Root):", doc.events?.length || 0);
        console.log("Events Count (Nested):", doc.fixture.events?.length || 0);
    } else {
        console.log("❌ Fixture not found.");
    }
    process.exit(0);
}

findFixture();
