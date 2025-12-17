import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const PredictionCard = ({ fixture }) => {
  const { fixtureId, date, tip, minute, status } = fixture;

  const [flash, setFlash] = useState(false);
  const prevScores = useRef({
    home: fixture.homeTeam?.score,
    away: fixture.awayTeam?.score,
  });

  const localTime = new Date(date).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const statusShort = typeof status === "object" ? status.short : status;
  const elapsed = typeof status === "object" ? status.elapsed : minute;

  const isLive = ["1H", "2H","HT", "LIVE"].includes(statusShort);

  const renderStatus = () => {
    if (statusShort === "FT") return "FT";
    if (statusShort === "HT") return "HT";
    if (statusShort === "NS") return localTime;
    if (isLive) return `${elapsed || 0}'`;
    return localTime;
  };

  const getTipColor = (tip, homeScore, awayScore, statusShort) => {
    if (statusShort !== "FT" && (homeScore == null || awayScore == null)) {
      return "text-orange-400";
    }

    const home = Number(homeScore);
    const away = Number(awayScore);

    switch (tip) {
      case "1":
        return home > away ? "text-green-500" : "text-red-500";
      case "X":
        return home === away ? "text-green-500" : "text-red-500";
      case "2":
        return away > home ? "text-green-500" : "text-red-500";
      case "1X":
        return home >= away ? "text-green-500" : "text-red-500";
      case "X2":
        return away >= home ? "text-green-500" : "text-red-500";
      default:
        return "text-teal-600";
    }
  };

  // ⚡ Flash animation on score change
  useEffect(() => {
    const homeScore = fixture.homeTeam?.score;
    const awayScore = fixture.awayTeam?.score;

    if (homeScore !== prevScores.current.home || awayScore !== prevScores.current.away) {
      setFlash(true);
      prevScores.current = { home: homeScore, away: awayScore };

      const timer = setTimeout(() => setFlash(false), 700);
      return () => clearTimeout(timer);
    }
  }, [fixture.homeTeam?.score, fixture.awayTeam?.score]);

  return (
   <Link to={`/predictions/${fixtureId}`} className="block">
  <div
    className={`max-w-xl mx-auto bg-white rounded-xl shadow-sm hover:shadow-md transition flex items-center justify-evenly flex-nowrap p-1 sm:p-2 overflow-hidden border-l-4 ${
      isLive ? "border-red-500 animate-pulse" : "border-transparent"
    }`}
  >
    {/* 🕒 Status / Time */}
    <div className="w-[45px] sm:w-[55px] flex-shrink-0 text-left">
  <p
    className={`text-xs sm:text-xs leading-none ${
      isLive ? "text-red-600 font-medium" : "text-gray-600 font-medium"
    }`}
  >
    {renderStatus()}
  </p>
</div>

    {/* 🏟️ Teams */}
    <div className="flex flex-col items-start text-left mx-1 sm:mx-2 w-[140px] sm:w-[200px]">
  <div className="flex items-center justify-start gap-1 sm:gap-2">
    <img
      src={fixture.homeTeam?.logo}
      alt={fixture.homeTeam?.name}
      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
    />
    <span className="font-medium text-gray-800 text-xs sm:text-sm truncate max-w-[97px] sm:max-w-[130px]">
      {fixture.homeTeam?.name}
    </span>
  </div>
  <div className="flex items-center justify-start gap-1 sm:gap-2">
    <img
      src={fixture.awayTeam?.logo}
      alt={fixture.awayTeam?.name}
      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
    />
    <span className="font-medium text-gray-800 text-[12px] sm:text-[14px] truncate max-w-[97px] sm:max-w-[130px]">
      {fixture.awayTeam?.name}
    </span>
  </div>
</div>


    {/* 💡 Tip */}
    <div className="text-center w-[35px] sm:w-[45px] flex-shrink-0">
      <p
        className={`text-xs sm:text-sm font-medium ${getTipColor(
          tip,
          fixture.homeTeam?.score,
          fixture.awayTeam?.score,
          statusShort
        )}`}
      >
        {tip}
      </p>
    </div>

    {/* ⚽ Scores */}
    <div
      className={`text-right font-medium text-xs sm:text-sm flex flex-col justify-center items-center w-[35px] sm:w-[45px] transition-all duration-300 ${
        flash ? "scale-125" : "scale-100"
      } ${isLive ? "text-red-600" : "text-gray-800"}`}
    >
      <span>{fixture.homeTeam?.score ?? " "}</span>
      <span>{fixture.awayTeam?.score ?? " "}</span>
    </div>
  </div>
</Link>

  );
};

export default PredictionCard;
