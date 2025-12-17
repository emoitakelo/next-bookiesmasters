const H2HSection = ({ h2h }) => {
  if (!h2h || h2h.length === 0)
    return <p className="text-center text-gray-400 mb-6">No H2H data available</p>;

  return (
    <div className="mb-6 max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold text-center text-gray-800 mb-2">Head to Head</h3>
      <div className="flex flex-col gap-2">
        {h2h.slice(0, 5).map((match) => {
          const matchDate = new Date(match.fixture.date).toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
            year: "2-digit",
          });

          return (
            <div
              key={match.fixture.id}
              className="grid grid-cols-4 items-center bg-gray-100 p-2 rounded text-sm"
            >
              {/* 1️⃣ Date */}
              <div className="truncate text-gray-500">{matchDate}</div>

              {/* 2️⃣ Home Team */}
              <div className="truncate font-medium">{match.teams.home.name}</div>

              {/* 3️⃣ Score */}
              <div className="flex justify-center font-semibold text-gray-700">
                {match.goals.home} - {match.goals.away}
              </div>

              {/* 4️⃣ Away Team */}
              <div className="truncate font-medium text-right">{match.teams.away.name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default H2HSection;
