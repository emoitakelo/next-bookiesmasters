import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Fixture from "./models/Fixture.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

async function checkId() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    const idToCheck = 1398110;
    console.log(`🔍 Searching for ID: ${idToCheck}`);

    const doc = await Fixture.findOne({
        $or: [
            { fixtureId: idToCheck },
            { "fixture.fixture.id": idToCheck },
        ]
    }).lean();

    if (doc) {
        console.log("✅ FOUND DOCUMENT!");
        console.log("ID:", doc.fixtureId);
        console.log("Nested ID:", doc.fixture?.fixture?.id);
    } else {
        console.log("❌ DOCUMENT NOT FOUND IN DB");
    }
    process.exit(0);
}

checkId();
