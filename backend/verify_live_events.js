import axios from "axios";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, ".env") });

const API_KEY = process.env.API_KEY;
const BASE_URL = "https://v3.football.api-sports.io";

async function verifyEvents() {
    try {
        console.log("📡 Fetching ALL live fixtures...");
        const response = await axios.get(`${BASE_URL}/fixtures`, {
            params: { live: "all" },
            headers: { "x-apisports-key": API_KEY }
        });

        const liveFixtures = response.data.response;
        console.log(`✅ Received ${liveFixtures.length} live matches.`);

        // Find Algeria vs Sudan
        const targetMatch = liveFixtures.find(f =>
            (f.teams.home.name.includes("Algeria") || f.teams.away.name.includes("Algeria")) &&
            (f.teams.home.name.includes("Sudan") || f.teams.away.name.includes("Sudan"))
        );

        if (targetMatch) {
            console.log(`\n🎯 FOUND MATCH: ${targetMatch.teams.home.name} vs ${targetMatch.teams.away.name}`);
            console.log(`   Score: ${targetMatch.goals.home} - ${targetMatch.goals.away}`);
            console.log(`   Time: ${targetMatch.fixture.status.elapsed}'`);

            console.log("\n📜 EVENTS DATA (Proof):");
            if (targetMatch.events && targetMatch.events.length > 0) {
                console.log(JSON.stringify(targetMatch.events, null, 2));
            } else {
                console.log("   (No events yet, or array is empty)");
            }
        } else {
            console.log("\n❌ Could not find 'Algeria vs Sudan' in live list.");
            console.log("Listing first 3 matches to check structure anyway:");
            liveFixtures.slice(0, 3).forEach(f => {
                console.log(`- ${f.teams.home.name} vs ${f.teams.away.name} (Events: ${f.events?.length || 0})`);
            });
        }

    } catch (err) {
        console.error("❌ Error:", err.message);
    }
}

verifyEvents();
