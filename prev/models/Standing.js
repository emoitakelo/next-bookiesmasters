// models/Standing.js
import mongoose from "mongoose";

const standingSchema = new mongoose.Schema({}, { strict: false });

const Standing = mongoose.model("Standing", standingSchema);

export default Standing;
