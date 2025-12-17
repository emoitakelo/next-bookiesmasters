import mongoose from "mongoose";

const PredictionSchema = new mongoose.Schema(
  {
    fixtureId: { type: Number, required: true, unique: true },

    fixture: {
      date: { type: String },
      timestamp: { type: Number },
      venue: {
        name: { type: String },
        city: { type: String },
      },
      status: {
        long: { type: String },
        short: { type: String },
        elapsed: { type: Number },
      },
    },

    league: {
      id: { type: Number },
      name: { type: String },
      country: { type: String },
      logo: { type: String },
      flag: { type: String },
      season: { type: Number },
      round: { type: String },
    },

    teams: {
      home: {
        id: { type: Number },
        name: { type: String },
        logo: { type: String },
      },
      away: {
        id: { type: Number },
        name: { type: String },
        logo: { type: String },
      },
    },

    predictions: {
      winner: {
        id: { type: Number },
        name: { type: String },
        comment: { type: String },
      },
      advice: { type: String },
      percent: {
        home: { type: String },
        draw: { type: String },
        away: { type: String },
      },
      goals: {
        home: { type: String },
        away: { type: String },
      },
      under_over: { type: String },
      win_or_draw: { type: Boolean },
    },

    comparison: {
      att: { home: String, away: String },
      def: { home: String, away: String },
      form: { home: String, away: String },
      goals: { home: String, away: String },
      h2h: { home: String, away: String },
      poisson_distribution: { home: String, away: String },
      total: { home: String, away: String },
    },

    h2h: [
      {
        fixture: {
          id: { type: Number },
          date: { type: String },
        },
        teams: {
          home: {
            id: { type: Number },
            name: { type: String },
            logo: { type: String },
          },
          away: {
            id: { type: Number },
            name: { type: String },
            logo: { type: String },
          },
        },
        goals: {
          home: { type: Number },
          away: { type: Number },
        },
      },
    ],

    createdAt: { type: Date, default: Date.now },
  },
  {
    strict: false, // ✅ Accepts any extra fields from API without schema definition
  }
);

// ✅ Indexes
PredictionSchema.index({ fixtureId: 1 });
PredictionSchema.index({ "teams.home.name": 1 });
PredictionSchema.index({ "teams.away.name": 1 });

// ✅ Safe model registration to prevent OverwriteModelError
const Prediction =
  mongoose.models.Prediction || mongoose.model("Prediction", PredictionSchema);

export default Prediction;
