// models/League.js
import mongoose from "mongoose";

const leagueSchema = new mongoose.Schema({}, { strict: false }); // saves all fields
const League = mongoose.model("League", leagueSchema);

export default League;
