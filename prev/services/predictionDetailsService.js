// services/predictionDetailsService.js
import Prediction from "../models/Prediction.js";
import Fixture from "../models/Fixture.js";
import { calculateTeamForm } from "../helpers/formCalculator.js";
import { mergePredictionDetails } from "../helpers/predictionMerger.js";

export const getPredictionDetailsService = async (fixtureId) => {
  try {
    console.log("🔍 [Service] Fetching prediction details for fixtureId:", fixtureId);

    // ✅ Ensure numeric type for consistent queries
    const fixtureIdNum = Number(fixtureId);

    // Try both `fixtureId` and nested `fixture.id` just in case
    const prediction = await Prediction.findOne({
      $or: [
        { fixtureId: fixtureIdNum },
        { "fixture.id": fixtureIdNum },
      ],
    }).lean();

    console.log(
      prediction
        ? `✅ Found prediction: ${prediction.teams?.home?.name} vs ${prediction.teams?.away?.name}`
        : "⚠️ No prediction found for fixtureId:", fixtureIdNum
    );

    const fixture = await Fixture.findOne({
      $or: [
        { "fixture.id": fixtureIdNum },
        { fixtureId: fixtureIdNum },
      ],
    }).lean();

    console.log(
      fixture
        ? `✅ Found fixture: ${fixture.teams?.home?.name} vs ${fixture.teams?.away?.name}`
        : "⚠️ No fixture found for fixtureId:", fixtureIdNum
    );

    if (!prediction || !fixture) {
      console.log("❌ Missing fixture or prediction data for fixtureId:", fixtureIdNum);
      return null;
    }

    // 🧮 Calculate form and last 5 matches for each team
    console.log("📊 Calculating form for home and away teams...");
    const homeData = await calculateTeamForm(fixture.teams.home.id);
    const awayData = await calculateTeamForm(fixture.teams.away.id);

    // 🧩 Merge data
    const merged = mergePredictionDetails({
      fixture,
      prediction,
      homeData,
      awayData,
    });

    console.log("✅ Merged prediction details ready.");
    return merged;

  } catch (error) {
    console.error("❌ Error in getPredictionDetailsService:", error);
    throw error;
  }
};
