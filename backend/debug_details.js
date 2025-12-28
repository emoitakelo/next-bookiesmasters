import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { getFixtureById } from "./services/fixtureService.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function debugDetails() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ MongoDB connected");

        const testId = "1398104"; // The CRASHING ID
        console.log(`🔍 Fetching details for ID: ${testId}`);

        const result = await getFixtureById(testId);

        if (!result) {
            console.error("❌ Result is NULL");
        } else {
            console.log("✅ Success! Result found.");
        }

        process.exit(0);
    } catch (err) {
        console.error("❌ EXCEPTION THROWN:", err);
        process.exit(1);
    }
}

debugDetails();
