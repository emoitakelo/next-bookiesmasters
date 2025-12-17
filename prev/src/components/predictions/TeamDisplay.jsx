import React from "react";

const TeamDisplay = ({ fixture }) => {
  if (!fixture) return null;

  console.log("Fixture data in TeamDisplay:", fixture);

  const { homeTeam, awayTeam, date, displayDate, status, venue } = fixture;

  // 🕒 Show "FT" or local time/date
  const matchDateTime =
    status === "FT"
      ? displayDate
      : new Date(date).toLocaleString("en-GB", {
          weekday: "short",
          hour: "2-digit",
          minute: "2-digit",
        });

  // 🟩 Render form badges
  const renderFormBars = (forms) => {
    if (!forms || !Array.isArray(forms) || forms.length === 0) return null;

    return (
      <div className="flex justify-center gap-1 mt-1">
        {forms.map((m, idx) => (
          <span
            key={idx}
            className="px-1 py-1 rounded text-white text-xs"
            style={{ backgroundColor: m.color }}
          >
            {m.result}
          </span>
        ))}
      </div>
    );
  };

  // ✅ Safely access actual match scores (only if FT)
  const homeScore =
    status === "FT" ? homeTeam?.last5Matches?.[0]?.score?.home ?? "-" : null;
  const awayScore =
    status === "FT" ? awayTeam?.last5Matches?.[0]?.score?.away ?? "-" : null;

  return (
    <div className="flex flex-col items-center mb-8 text-gray-800">
      {/* 🏟️ Team names */}
      <h2 className="text-lg sm:text-xl font-semibold mb-3 text-center">
        {homeTeam?.name} vs {awayTeam?.name}
      </h2>

      {/* 🖼️ Logos + score/time */}
      <div className="grid grid-cols-3 items-center gap-6 max-w-2xl w-full">
        {/* Home */}
        <div className="flex flex-col items-center">
          <img
            src={homeTeam?.logo}
            alt={homeTeam?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
          {renderFormBars(homeTeam?.last5Matches)}
        </div>

        {/* Center */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="text-sm sm:text-base text-gray-600">
            {status === "FT" ? "FT" : matchDateTime}
          </div>

          {/* ✅ Show scores only if match is finished */}
          {status === "FT" && (
            <div className="text-lg text-black sm:text-xl font-bold mt-1">
              <span>{homeScore}</span> - <span>{awayScore}</span>
            </div>
          )}
        </div>

        {/* Away */}
        <div className="flex flex-col items-center">
          <img
            src={awayTeam?.logo}
            alt={awayTeam?.name}
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
          {renderFormBars(awayTeam?.last5Matches)}
        </div>
      </div>

      {/* Venue */}
      {venue && (
        <p className="mt-4 text-gray-500 text-sm text-center italic">
          {venue}
        </p>
      )}
    </div>
  );
};

export default TeamDisplay;
