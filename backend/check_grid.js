
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixture.js";

dotenv.config();

async function checkGrid() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        // Find a fixture with lineups
        const match = await Fixture.findOne({ "lineups.0.startXI.0": { $exists: true } });

        if (match) {
            console.log(`✅ Found match: ${match.fixture.teams.home.name} vs ${match.fixture.teams.away.name}`);
            const l = match.lineups[0];
            console.log(`Formation: ${l.formation}`);
            console.log("Player 1 Grid:", l.startXI[0].player.grid);
            console.log("Player 2 Grid:", l.startXI[1].player.grid);
        } else {
            console.log("❌ No matches with full lineups found.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkGrid();
