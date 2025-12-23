import axios from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(process.cwd(), "backend", ".env") });

const api = axios.create({
    baseURL: "https://v3.football.api-sports.io",
    headers: {
        "x-apisports-key": process.env.API_KEY
    }
});

async function run() {
    try {
        // IDs of two finished matches (from previous debug logs or randomly picked big ones)
        // 1378969 (Liverpool vs Bournemouth)
        // 1469559 (Brisbane Roar vs Macarthur)
        // Format for 'ids' parameter is usually id-id-id
        const ids = "1378969-1469559";

        console.log(`Testing bulk fetch for IDs: ${ids}`);

        const res = await api.get("/fixtures", {
            params: { ids: ids }
        });

        const data = res.data.response;
        console.log(`Received ${data.length} fixtures.`);

        if (data.length > 0) {
            data.forEach(f => {
                console.log(`\nID: ${f.fixture.id} - ${f.teams.home.name} vs ${f.teams.away.name}`);
                console.log(`Has Events: ${!!f.events} (Count: ${f.events ? f.events.length : 0})`);
                if (f.events && f.events.length > 0) {
                    console.log("First Event Type:", f.events[0].type);
                }
            });
        }

    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error("API Response:", err.response.data);
    }
}

run();
