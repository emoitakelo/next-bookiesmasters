
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixture.js";

dotenv.config();

async function checkLineupJSON() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const match = await Fixture.findOne({
            "fixture.teams.home.name": /Wanderers/i,
            "fixture.teams.away.name": /Macarthur/i
        }).lean();

        if (match && match.lineups && match.lineups.length > 0) {
            console.log(JSON.stringify(match.lineups, null, 2));
        } else {
            console.log("❌ No lineups in DB.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkLineupJSON();
