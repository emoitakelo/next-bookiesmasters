import mongoose from "mongoose";

const FixtureSchema = new mongoose.Schema(
  {
    // Your top-level ID
    fixtureId: { type: Number, unique: true, required: true },

    // Full API-Football fixture payload
    fixture: { type: Object, required: true },

    prediction: { type: Object, default: null },
    h2h: { type: Array, default: [] },
    odds: { type: Array, default: [] },
    liveOdds: { type: Array, default: [] }, // Separate field for live odds

    // Live-only data
    livescore: { type: Object, default: null },
    lastLiveUpdate: { type: Date, default: null }
  },
  { timestamps: true, strict: false }
);

/* --------------------------------------------------
    🔥 ESSENTIAL INDEXES FOR PERFORMANCE
-------------------------------------------------- */

// 1️⃣ Unique lookup for updates
FixtureSchema.index({ fixtureId: 1 }, { unique: true });

// 2️⃣ Index on API-Football's nested fixture.id
FixtureSchema.index({ "fixture.fixture.id": 1 });

// 3️⃣ Index on match date (nested field)
FixtureSchema.index({ "fixture.fixture.date": 1 });

// 4️⃣ Index on league ID
FixtureSchema.index({ "fixture.league.id": 1 });

// 5️⃣ Index on updatedAt to quickly fetch latest items
FixtureSchema.index({ updatedAt: -1 });

export default mongoose.models.Fixture || mongoose.model("Fixture", FixtureSchema);
