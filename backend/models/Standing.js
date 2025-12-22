import mongoose from "mongoose";

const StandingSchema = new mongoose.Schema(
    {
        league: {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            country: { type: String },
            logo: { type: String },
            flag: { type: String },
            season: { type: Number, required: true }
        },
        // The raw API-Football 'standings' array
        // For simple leagues: [ [ {rank:1...}, {rank:2...} ] ]
        // For groups: [ [ {group:'Group A'...} ], [ {group:'Group B'...} ] ]
        standings: { type: Array, default: [] }
    },
    { timestamps: true }
);

// Indexes for fast retrieval
StandingSchema.index({ "league.id": 1, "league.season": 1 }, { unique: true });

export default mongoose.models.Standing || mongoose.model("Standing", StandingSchema);
