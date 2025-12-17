import mongoose from "mongoose";

const liveScoreSchema = new mongoose.Schema(
  {
    fixtureId: { type: Number, required: true, unique: true },
    fullData: { type: Object }, // 🧠 store the entire live object
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.LiveScore ||
  mongoose.model("LiveScore", liveScoreSchema);
