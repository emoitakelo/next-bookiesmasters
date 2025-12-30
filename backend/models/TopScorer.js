import mongoose from "mongoose";

const TopScorerSchema = new mongoose.Schema(
    {
        league: {
            id: { type: Number, required: true },
            name: { type: String, required: true },
            season: { type: Number, required: true },
            logo: String,
            flag: String
        },
        players: [
            {
                rank: Number,
                player: {
                    id: Number,
                    name: String,
                    firstname: String,
                    lastname: String,
                    age: Number,
                    nationality: String,
                    photo: String
                },
                team: {
                    id: Number,
                    name: String,
                    logo: String
                },
                statistics: {
                    goals: {
                        total: Number,
                        assists: Number,
                        conceded: Number,
                        saves: Number
                    },
                    games: {
                        appearences: Number,
                        minutes: Number,
                        rating: String
                    }
                }
            }
        ],
        updatedAt: { type: Date, default: Date.now }
    },
    { timestamps: true }
);

// Unique index to prevent duplicate entries for same league/season
TopScorerSchema.index({ "league.id": 1, "league.season": 1 }, { unique: true });

export default mongoose.models.TopScorer || mongoose.model("TopScorer", TopScorerSchema);
