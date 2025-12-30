import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";
import { getFixturesGroupedByLeague } from "./services/fixtureCardService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function checkSize() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const date = new Date().toISOString().split("T")[0];

        console.log("Fetching fixtures...");
        const start = Date.now();

        // We manually replicate the query to get the raw docs
        // Replicating the logic from fixtureCardService roughly
        const startOfDayKenya = new Date(`${date}T00:00:00+03:00`);
        const endOfDayKenya = new Date(`${date}T23:59:59.999+03:00`);

        const matchFilter = {
            "fixture.fixture.date": {
                $gte: startOfDayKenya.toISOString(),
                $lte: endOfDayKenya.toISOString()
            },
            "odds": { $exists: true, $not: { $size: 0 } }
        };

        const fixtures = await Fixture.find(matchFilter)
            .select({
                "fixture.id": 1,
                "fixture.fixture": 1,
                "fixture.events": 1,
                "odds": { $slice: 1 }
            })
            .lean();

        const duration = Date.now() - start;
        console.log(`⏱️ Fetch took ${duration}ms`);
        console.log(`📦 Docs found: ${fixtures.length}`);

        if (fixtures.length > 0) {
            const jsonStr = JSON.stringify(fixtures);
            const sizeBytes = Buffer.byteLength(jsonStr, 'utf8');
            const avgSize = sizeBytes / fixtures.length;

            console.log(`📊 Total Payload Size: ${(sizeBytes / 1024).toFixed(2)} KB`);
            console.log(`📏 Avg Doc Size: ${(avgSize / 1024).toFixed(2)} KB`);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkSize();
