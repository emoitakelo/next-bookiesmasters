import React, { useEffect, useState, useCallback } from "react";
import PredictionList from "../components/predictions/PredictionList";
import DateNavigator from "../components/predictions/DateNavigator";
import Loader from "../../../frontend-next/components/common/Loader";
import axiosInstance from "../utils/axiosInstance";

const Predictions = ({ initialData = [] }) => {
  const [predictions, setPredictions] = useState(initialData);
  const [loading, setLoading] = useState(initialData.length === 0);
  const [currentDate, setCurrentDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  const today = new Date();

  // 🔹 Helper: merge live scores into predictions
  const mergeLiveScores = (predData, liveData) => {
    const liveMap = {};
    liveData.forEach((live) => {
      if (live && live.fixtureId) liveMap[live.fixtureId] = live;
    });

    return predData.map((league) => ({
      ...league,
      fixtures: league.fixtures.map((fixture) => {
        const live = liveMap[fixture.fixtureId];
        if (!live) return { ...fixture };

        const isLive = !["FT", "AET", "PEN"].includes(
          live.fullData.fixture.status.short
        );

        return {
          ...fixture,
          status: isLive
            ? live.fullData.fixture.status.short
            : fixture.status,
          minute: isLive
            ? live.fullData.fixture.status.elapsed ?? 0
            : fixture.minute,
          displayDate: isLive
            ? `${live.fullData.fixture.status.elapsed ?? ""}'`
            : fixture.displayDate,
          homeTeam: {
            ...fixture.homeTeam,
            score: isLive
              ? live.fullData.goals.home
              : fixture.homeTeam.score,
          },
          awayTeam: {
            ...fixture.awayTeam,
            score: isLive
              ? live.fullData.goals.away
              : fixture.awayTeam.score,
          },
        };
      }),
    }));
  };

  // 🔹 Fetch predictions + live scores manually when date changes
  const fetchPredictions = useCallback(async (date) => {
    try {
      setLoading(true);
      const [predRes, liveRes] = await Promise.all([
        axiosInstance.get(`/predictions?date=${date}`),
        axiosInstance.get(`/livescores?date=${date}`),
      ]);

      const predData = predRes.data?.data || [];
      const liveData = liveRes.data?.data || [];
      setPredictions(mergeLiveScores(predData, liveData));
    } catch (err) {
      console.error("❌ Error fetching predictions/livescores:", err);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Only fetch if user changes the date manually (not at first mount)
  useEffect(() => {
    if (initialData.length && currentDate === today.toISOString().split("T")[0])
      return; // already preloaded
    fetchPredictions(currentDate);
  }, [currentDate, fetchPredictions, today, initialData]);

  // 🔹 Smooth live update for today's fixtures
  useEffect(() => {
    if (currentDate !== today.toISOString().split("T")[0]) return;
    const interval = setInterval(async () => {
      try {
        const liveRes = await axiosInstance.get(`/livescores?date=${currentDate}`);
        const liveData = liveRes.data?.data || [];
        if (!liveData.length) return;
        setPredictions((prevPredictions) =>
          mergeLiveScores(prevPredictions, liveData)
        );
      } catch (err) {
        console.error("❌ Error updating live scores:", err);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [currentDate, today]);

  const handleChangeDate = (newDate) => {
    if (loading) return;
    setCurrentDate(newDate);
  };

  return (
    <main className="max-w-xl mx-auto px-1 sm:px-3">
      <DateNavigator
        currentDate={currentDate}
        onChangeDate={handleChangeDate}
        loading={loading}
      />
      {loading ? (
        <Loader size={30} color="teal-500" height="h-40" />
      ) : predictions.length > 0 ? (
        <PredictionList predictions={predictions} />
      ) : (
        <p className="text-center text-gray-500">
          No predictions available for this date.
        </p>
      )}
    </main>
  );
};

export default Predictions;
