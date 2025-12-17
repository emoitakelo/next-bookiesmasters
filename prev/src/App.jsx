import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Predictions from "./pages/Predictions";
import PredictionDetails from "./pages/PredictionDetails";

export default function App({ initialData = [], logoReady = false }) {
  // If something fails (like missing data), fallback to an empty screen
  if (!logoReady) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* 🧭 Navbar (logo already preloaded before mount) */}
      <Navbar />

      {/* 🏠 Main content */}
      <main className="flex-grow">
        <Routes>
          <Route
            path="/"
            element={<Predictions initialData={initialData} />}
          />
          <Route
            path="/predictions/:fixtureId"
            element={<PredictionDetails />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* ⚽ Footer */}
      <Footer />
    </div>
  );
}
