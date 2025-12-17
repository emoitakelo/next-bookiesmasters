import mongoose from "mongoose";

const FixtureSchema = new mongoose.Schema(
  {
    fixture: { type: Object, required: true },
    league: { type: Object, required: true },
    teams: { type: Object, required: true },
    goals: { type: Object },
    score: { type: Object },
  },
  { strict: false } // allow extra fields from API without defining them
);

export default mongoose.model("Fixture", FixtureSchema);
