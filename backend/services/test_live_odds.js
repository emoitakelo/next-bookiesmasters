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
        console.log("Testing /odds/live endpoint...");

        // This endpoint typically returns ALL live odds changes
        // Sometimes it requires 'bet' parameter (e.g. 1 for Match Winner)
        const { data } = await api.get("/odds/live", {
            params: {
                bet: 1 // Match Winner
            }
        });

        console.log("Status:", data.errors.length > 0 ? "Has Errors" : "Success");
        if (data.errors.length > 0) {
            console.log("Errors:", data.errors);
        }

        const odds = data.response || [];
        console.log(`Received ${odds.length} live odds objects.`);

        if (odds.length > 0) {
            console.log("Sample:", JSON.stringify(odds[0], null, 2));
        } else {
            console.log("No live odds returned. (This might check 'all' or might need specific subscription).");
        }

    } catch (err) {
        console.error("Error:", err.message);
        if (err.response) console.error("Response:", err.response.data);
    }
}

run();
