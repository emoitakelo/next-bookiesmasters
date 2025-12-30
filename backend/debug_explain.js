import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function debugQuery() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const date = new Date().toISOString().split("T")[0]; // Today
        const startOfDayKenya = new Date(`${date}T00:00:00+03:00`);
        const endOfDayKenya = new Date(`${date}T23:59:59.999+03:00`);

        const matchFilter = {
            "fixture.fixture.date": {
                $gte: startOfDayKenya.toISOString(),
                $lte: endOfDayKenya.toISOString()
            },
            "odds": { $exists: true, $not: { $size: 0 } }
        };

        console.log("🔍 Explaining Query:", JSON.stringify(matchFilter, null, 2));

        const explanation = await Fixture.find(matchFilter)
            .select({ "fixture.id": 1 })
            .explain("executionStats");

        console.log("📊 Stats:", JSON.stringify(explanation.executionStats, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debugQuery();
