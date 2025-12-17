
import React from "react";

interface MatchTeam {
    id: number;
    name: string;
    logo: string;
    winner: boolean | null;
}

interface MatchGoals {
    home: number | null;
    away: number | null;
}

interface H2HMatch {
    fixture: {
        id: number;
        date: string;
        status: { short: string; long: string };
    };
    teams: {
        home: MatchTeam;
        away: MatchTeam;
    };
    goals: MatchGoals;
    score: {
        halftime: MatchGoals;
        fulltime: MatchGoals;
    };
}

interface H2HSectionProps {
    h2h: H2HMatch[];
}

const H2HSection: React.FC<H2HSectionProps> = ({ h2h }) => {
    if (!h2h || h2h.length === 0)
        return <p className="text-center text-gray-500 mb-6">No H2H data available</p>;

    return (
        <div className="mb-6 max-w-3xl mx-auto bg-[#1F1F1F] p-4 rounded-lg shadow-sm border border-gray-800">
            <h3 className="text-lg font-semibold text-center text-gray-300 mb-4 uppercase tracking-wider">Head to Head</h3>
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
                            className="grid grid-cols-[auto_1fr_auto_1fr] md:grid-cols-4 items-center bg-[#282828] hover:bg-[#333333] p-2 rounded text-sm transition-colors border-b border-gray-700 last:border-0"
                        >
                            {/* 1️⃣ Date */}
                            <div className="truncate text-gray-400 text-xs md:text-sm mr-2">{matchDate}</div>

                            {/* 2️⃣ Home Team */}
                            <div className={`truncate font-medium text-right pr-3 ${match.teams.home.winner ? 'text-green-500 font-bold' : 'text-gray-300'}`}>
                                {match.teams.home.name}
                            </div>

                            {/* 3️⃣ Score */}
                            <div className="flex justify-center font-bold text-gray-900 bg-gray-300 px-2 rounded min-w-[3rem]">
                                {match.goals.home} - {match.goals.away}
                            </div>

                            {/* 4️⃣ Away Team */}
                            <div className={`truncate font-medium text-left pl-3 ${match.teams.away.winner ? 'text-green-500 font-bold' : 'text-gray-300'}`}>
                                {match.teams.away.name}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default H2HSection;
