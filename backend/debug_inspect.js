import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function inspectOne() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Fetch just one fixture, sorting by ID to get a predictable one
        const f = await Fixture.findOne({}).sort({ fixtureId: 1 });

        if (!f) {
            console.log("❌ DB is completely empty. No fixtures found at all.");
        } else {
            console.log("✅ Sample Fixture Found:");
            console.log("--------------------------------------------------");
            // detailed log of the date location
            console.log("Top Level Keys:", Object.keys(f.toObject()));
            if (f.fixture && f.fixture.fixture) {
                console.log("fixture.fixture.date:", f.fixture.fixture.date);
                console.log("Type of date:", typeof f.fixture.fixture.date);
            } else {
                console.log("Structure does not match 'fixture.fixture.date'");
                console.log("Full 'fixture' object keys:", f.fixture ? Object.keys(f.fixture) : "null");
            }
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

inspectOne();
