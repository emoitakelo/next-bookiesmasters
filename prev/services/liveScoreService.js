import axios from "axios";
import LiveScore from "../models/LiveScore.js";
import Prediction from "../models/Prediction.js";

export const fetchAndUpdateLiveScores = async () => {
  try {
    console.log("♻️ Refreshing full live scores...");

    // 1️⃣ Fetch ALL live fixtures from API-Football
    const { data } = await axios.get("https://v3.football.api-sports.io/fixtures?live=all", {
      headers: { "x-apisports-key": process.env.API_KEY },
    });

    if (!data.response || data.response.length === 0) {
      console.log("⚠️ No live fixtures returned from API");
      return;
    }

    // 2️⃣ Get all fixture IDs already present in predictions
    const existingIds = await Prediction.distinct("fixtureId");
    if (!existingIds.length) {
      console.log("⚠️ No fixture IDs found in predictions collection");
      return;
    }

    // 3️⃣ Keep only live fixtures that match your predictions
    const filteredLives = data.response.filter(fix =>
      existingIds.includes(fix.fixture.id)
    );

    if (filteredLives.length === 0) {
      console.log("⚠️ No live fixtures matched with existing predictions");
      return;
    }

    // 4️⃣ Prepare upsert operations (do NOT delete existing)
    const operations = filteredLives.map(fix => ({
      updateOne: {
        filter: { fixtureId: fix.fixture.id },
        update: {
          $set: {
            fullData: fix,
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    await LiveScore.bulkWrite(operations);

    console.log(`✅ Upserted ${filteredLives.length} live fixtures`);
  } catch (error) {
    console.error("❌ Live score update failed:", error.message);
  }
};
