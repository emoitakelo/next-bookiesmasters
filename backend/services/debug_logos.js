import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import axios from "axios";
import Fixture from "../models/Fixture.js";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

async function checkLogos() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        // Get recent fixtures
        const fixtures = await Fixture.find()
            .sort({ "fixture.fixture.date": -1 })
            .limit(50)
            .lean();

        console.log(`Checking logos for ${fixtures.length} fixtures...`);

        const urlsToCheck = new Set();
        fixtures.forEach(doc => {
            if (doc.fixture.teams.home.logo) urlsToCheck.add(doc.fixture.teams.home.logo);
            if (doc.fixture.teams.away.logo) urlsToCheck.add(doc.fixture.teams.away.logo);
        });

        console.log(`Found ${urlsToCheck.size} unique logo URLs. Testing validity...`);

        let brokenLinks = 0;

        // Check in batches
        const urls = Array.from(urlsToCheck);
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            try {
                await axios.head(url, { timeout: 5000 });
                // console.log(`✅ OK: ${url}`);
            } catch (err) {
                console.error(`❌ BROKEN: ${url} - ${err.message}`);
                brokenLinks++;
            }
        }

        console.log("Done.");
        console.log(`Broken Links: ${brokenLinks}`);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

checkLogos();
