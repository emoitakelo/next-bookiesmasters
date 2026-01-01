
import mongoose from "mongoose";
import dotenv from "dotenv";
import League from "./models/League.js";

dotenv.config();

mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookiesmasters")
    .then(async () => {
        console.log("Connected.");
        const leagues = await League.find({});
        const tally = {};
        leagues.forEach(l => {
            const s = l.season || (l.league ? l.league.season : "unknown");
            tally[s] = (tally[s] || 0) + 1;
        });
        console.log("Season Distribution:", tally);

        // Also show a few examples of 2021 if exist
        const old = leagues.filter(l => (l.season || l.league?.season) == 2021).slice(0, 3);
        if (old.length) {
            console.log("Sample 2021 Leagues:", old.map(l => l.league.name));
        }

        process.exit(0);
    })
    .catch(e => { console.error(e); process.exit(1); });
