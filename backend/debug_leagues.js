
import mongoose from "mongoose";
import dotenv from "dotenv";
import League from "./models/League.js";

dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/bookiesmasters";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to Mongo");
        const leagues = await League.find({}).limit(5);
        console.log("Found leagues:", leagues.map(l => ({ id: l.league.id, name: l.league.name, odds: l.odds })));

        // Check if any league has odds: true
        const oddsLeagues = await League.find({ odds: true });
        console.log("Leagues with odds=true:", oddsLeagues.length);

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
