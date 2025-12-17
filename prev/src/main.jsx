import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import axiosInstance from "./utils/axiosInstance";

// ✅ Preload logo
import logo from "./assets/logo.png";

// 🕒 Today’s date (UTC)
const today = new Date().toISOString().split("T")[0];

// ✅ Helper: preload logo
function preloadLogo(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(true);
    img.onerror = reject;
  });
}

// ✅ Helper: fetch and merge before rendering
async function preloadAppData() {
  try {
    const [predRes, liveRes] = await Promise.all([
      axiosInstance.get(`/predictions?date=${today}`),
      axiosInstance.get(`/livescores?date=${today}`),
    ]);

    const predData = predRes.data?.data || [];
    const liveData = liveRes.data?.data || [];

    // --- Merge logic (same as your Predictions.jsx)
    const liveMap = {};
    liveData.forEach((live) => {
      if (live && live.fixtureId) liveMap[live.fixtureId] = live;
    });

    const merged = predData.map((league) => ({
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

    return merged;
  } catch (err) {
    console.error("❌ Preload error:", err);
    return [];
  }
}

// ✅ Bootstrap app cleanly
async function bootstrap() {
  try {
    // Wait for both logo and data
    await preloadLogo(logo);
    const initialData = await preloadAppData();

    // 🌟 Reveal the app only when everything is ready
document.documentElement.style.visibility = "visible"; // html
document.body.style.visibility = "visible";             // body
document.documentElement.style.overflow = "auto";
document.body.style.overflow = "auto";

    ReactDOM.createRoot(document.getElementById("root")).render(
      <BrowserRouter>
        <App initialData={initialData} logoReady={true} />
      </BrowserRouter>
    );
  } catch (err) {
    console.error("App failed to load:", err);
  }
}

bootstrap();
