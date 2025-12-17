import React from "react";

const LastFiveMatches = ({ teamLogo, teamName, matches }) => {
  if (!matches || matches.length === 0) return null;

  const getScoreBadgeColor = (isHome, homeScore, awayScore) => {
    const our = isHome ? homeScore : awayScore;
    const opp = isHome ? awayScore : homeScore;

    if (our === opp) return "bg-orange-200 text-orange-800"; // Draw
    if (our > opp) return "bg-green-200 text-green-800";     // Win
    return "bg-red-200 text-red-800";                        // Loss
  };

  return (
    <div className="mb-8 max-w-3xl mx-auto">
      {/* 🏆 Title + Team Logo centered */}
      <div className="flex flex-col items-center mb-4">
        <div className="flex items-center justify-center gap-2">
          {teamLogo && (
            <img
              src={teamLogo}
              alt={`${teamName} Logo`}
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
            />
          )}
          <h4 className="text-md sm:text-lg font-semibold text-gray-800 text-center">
            Last 5 Matches
          </h4>
        </div>
      </div>

      {/* 🏟️ Matches List */}
      <div className="flex flex-col gap-2">
        {matches.map((m, i) => {
          const isHome = m.homeTeam.name === teamName;
          const homeScore = Number(m.score.home);
          const awayScore = Number(m.score.away);

          const matchDate = new Date(m.date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          });

          return (
            <div
              key={i}
              className="grid grid-cols-4 items-center bg-gray-50 border p-2 rounded text-sm"
            >
              {/* 1️⃣ Date */}
              <div className="truncate text-gray-500">{matchDate}</div>

              {/* 2️⃣ Home Team */}
              <div className="truncate font-medium">{m.homeTeam.name}</div>

              {/* 3️⃣ Score with perspective-based badge */}
              <div className="flex justify-center">
                <span
                  className={`w-16 text-center px-2 py-1 rounded font-semibold ${getScoreBadgeColor(
                    isHome,
                    homeScore,
                    awayScore
                  )}`}
                >
                  {homeScore} - {awayScore}
                </span>
              </div>

              {/* 4️⃣ Away Team */}
              <div className="truncate font-medium text-right">{m.awayTeam.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LastFiveMatches;
