
import React from "react";
import Image from "next/image";

interface LastMatch {
    date: string;
    homeTeam: { name: string; logo?: string };
    awayTeam: { name: string; logo?: string };
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
        <div className="mb-6 max-w-3xl mx-auto bg-[#1F1F1F] p-4 rounded-xl shadow-sm border border-white/5">
            {/* 🏆 Title + Team Logo centered */}
            <div className="flex flex-col items-center mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center justify-center gap-2">
                    {teamLogo && (
                        <img
                            src={teamLogo}
                            alt={`${teamName} Logo`}
                            className="w-6 h-6 object-contain"
                        />
                    )}
                    <h4 className="text-sm font-bold text-gray-200 text-center uppercase tracking-wide">
                        Last 5 Matches: <span className="text-teal-400">{teamName}</span>
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
                            className="grid grid-cols-[auto_1fr_auto_1fr] md:grid-cols-4 items-center bg-white/5 hover:bg-white/10 p-2 rounded text-sm transition-colors border border-transparent hover:border-white/5"
                        >
                            {/* 1️⃣ Date */}
                            <div className="truncate text-gray-500 text-xs mr-2">{matchDate}</div>

                            {/* 2️⃣ Home Team */}
                            <div className="flex items-center justify-end gap-2 pr-3 min-w-0">
                                <span className="truncate font-medium text-gray-300 text-xs md:text-sm">{m.homeTeam.name}</span>
                                {m.homeTeam.logo && (
                                    <img src={m.homeTeam.logo} alt={m.homeTeam.name} className="w-5 h-5 object-contain flex-shrink-0" />
                                )}
                            </div>

                            {/* 3️⃣ Score with perspective-based badge */}
                            <div className="flex justify-center">
                                <span
                                    className="w-14 text-center px-1.5 py-0.5 rounded font-bold text-[10px]"
                                    style={{ backgroundColor: m.color, color: m.result === "D" ? "#7c2d12" : (m.result === "W" ? "#14532d" : "#7f1d1d") }}
                                >
                                    {m.score.home} - {m.score.away}
                                </span>
                            </div>

                            {/* 4️⃣ Away Team */}
                            <div className="flex items-center justify-start gap-2 pl-3 min-w-0">
                                {m.awayTeam.logo && (
                                    <img src={m.awayTeam.logo} alt={m.awayTeam.name} className="w-5 h-5 object-contain flex-shrink-0" />
                                )}
                                <span className="truncate font-medium text-gray-300 text-xs md:text-sm">{m.awayTeam.name}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LastFiveMatches;
