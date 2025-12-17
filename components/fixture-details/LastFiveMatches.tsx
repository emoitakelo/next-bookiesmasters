
import React from "react";
import Image from "next/image";

interface LastMatch {
    date: string;
    homeTeam: { name: string };
    awayTeam: { name: string };
    score: { home: number; away: number };
    result: "W" | "L" | "D";
    color: string;
}

interface LastFiveMatchesProps {
    teamLogo?: string;
    teamName: string;
    matches: LastMatch[];
}

const LastFiveMatches: React.FC<LastFiveMatchesProps> = ({ teamLogo, teamName, matches }) => {
    if (!matches || matches.length === 0) return null;

    return (
        <div className="mb-8 max-w-3xl mx-auto bg-[#1F1F1F] p-4 rounded-lg shadow-sm border border-gray-800">
            {/* 🏆 Title + Team Logo centered */}
            <div className="flex flex-col items-center mb-4 border-b border-gray-700 pb-2">
                <div className="flex items-center justify-center gap-2">
                    {teamLogo && (
                        <Image
                            src={teamLogo}
                            alt={`${teamName} Logo`}
                            width={32}
                            height={32}
                            className="object-contain"
                        />
                    )}
                    <h4 className="text-md sm:text-lg font-semibold text-gray-200 text-center">
                        Last 5 Matches: <span className="text-teal-500">{teamName}</span>
                    </h4>
                </div>
            </div>

            {/* 🏟️ Matches List */}
            <div className="flex flex-col gap-2">
                {matches.map((m, i) => {
                    const matchDate = new Date(m.date).toLocaleDateString("en-US", {
                        month: "2-digit",
                        day: "2-digit",
                        year: "2-digit",
                    });

                    return (
                        <div
                            key={i}
                            className="grid grid-cols-[auto_1fr_auto_1fr] md:grid-cols-4 items-center bg-[#282828] border border-gray-700 p-2 rounded text-sm hover:bg-[#333333] transition-colors"
                        >
                            {/* 1️⃣ Date */}
                            <div className="truncate text-gray-400 text-xs md:text-sm mr-2">{matchDate}</div>

                            {/* 2️⃣ Home Team */}
                            <div className="truncate font-medium text-right pr-3 text-gray-300">{m.homeTeam.name}</div>

                            {/* 3️⃣ Score with perspective-based badge */}
                            <div className="flex justify-center">
                                <span
                                    className="w-16 text-center px-2 py-1 rounded font-bold text-xs text-white"
                                    style={{ backgroundColor: m.color }}
                                >
                                    {m.score.home} - {m.score.away}
                                </span>
                            </div>

                            {/* 4️⃣ Away Team */}
                            <div className="truncate font-medium text-left pl-3 text-gray-300">{m.awayTeam.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LastFiveMatches;
