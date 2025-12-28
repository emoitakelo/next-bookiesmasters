import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getFixturesGroupedByLeague } from "./services/fixtureCardService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function runBenchmark() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const date = new Date().toISOString().split("T")[0]; // Today
        console.log(`🔥 Benchmarking for date: ${date}`);

        console.time("TotalExecution");
        const result = await getFixturesGroupedByLeague(date);
        console.timeEnd("TotalExecution");

        console.log(`📊 Found ${result.length} leagues.`);

        let totalMatches = 0;
        result.forEach(l => totalMatches += l.matches.length);
        console.log(`⚽ Total Matches Returned: ${totalMatches}`);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

runBenchmark();
