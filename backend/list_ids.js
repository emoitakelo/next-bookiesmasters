import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function listIds() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const docs = await Fixture.find({}, { fixtureId: 1, "fixture.fixture.id": 1 }).limit(5).lean();
    console.log("DOCS:", JSON.stringify(docs, null, 2));
    process.exit(0);
}

listIds();
