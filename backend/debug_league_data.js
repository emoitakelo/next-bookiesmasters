
import mongoose from "mongoose";
import dotenv from "dotenv";
import League from "./models/League.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/bookiesmasters";

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log("Connected to Mongo");
        const sample = await League.findOne({});
        console.log("Sample League:", JSON.stringify(sample, null, 2));

        const allLeagues = await League.countDocuments({});
        console.log("Total Saved Leagues:", allLeagues);

        const trueOdds = await League.countDocuments({ odds: true });
        console.log("Leagues with odds=true (bool):", trueOdds);

        const stringOdds = await League.countDocuments({ odds: "true" });
        console.log("Leagues with odds='true' (string):", stringOdds);

        mongoose.disconnect();
    })
    .catch(err => console.error(err));
