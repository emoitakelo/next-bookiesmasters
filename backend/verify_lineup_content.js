
import mongoose from "mongoose";
import dotenv from "dotenv";
import Fixture from "./models/Fixture.js";

dotenv.config();

async function checkLineupContent() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const match = await Fixture.findOne({
            "fixture.teams.home.name": /Wanderers/i,
            "fixture.teams.away.name": /Macarthur/i
        });

        if (match && match.lineups && match.lineups.length > 0) {
            console.log("✅ Lineup Data Exists:");
            match.lineups.forEach(l => {
                console.log(`\nTeam: ${l.team.name} (${l.formation})`);
                const players = l.startXI.map(p => p.player.name).join(", ");
                console.log(`Start XI: ${players.substring(0, 50)}...`);
            });
        } else {
            console.log("❌ No lineups in DB.");
        }

    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkLineupContent();
