import Fixture from "../models/Fixture.js";
import Prediction from "../models/Prediction.js";
import { mergeFixturesPredictions } from "../helpers/fixtureMerger.js";

export const getPredictionsByDateService = async (date) => {
  try {
    const start = `${date}T00:00:00+00:00`;
    const end = `${date}T23:59:59+00:00`;

    console.log(`🕐 Query range: ${start} → ${end}`);

    // Try both Date objects and string ISO matching
    const fixtures = await Fixture.find({
      $or: [
        {
          "fixture.date": {
            $gte: new Date(start),
            $lte: new Date(end),
          },
        },
        {
          // fallback for string-stored ISO dates
          "fixture.date": { $gte: start, $lte: end },
        },
      ],
    }).lean();

    console.log(`✅ Found ${fixtures.length} fixtures for ${date}`);

    if (fixtures.length === 0) return [];

    const fixtureIds = fixtures.map((f) => f.fixture.id);
    console.log("🎯 Fixture IDs:", fixtureIds);

    const predictions = await Prediction.find({
      fixtureId: { $in: fixtureIds },
    }).lean();

    console.log(`✅ Found ${predictions.length} predictions for ${date}`);

    const merged = mergeFixturesPredictions(fixtures, predictions);

    return merged;
  } catch (error) {
    console.error("❌ Error in getPredictionsByDateService:", error);
    throw error;
  }
};
