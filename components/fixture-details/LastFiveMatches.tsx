
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
        <div className="mb-6 max-w-3xl mx-auto bg-[#1F1F1F] p-4 rounded-xl shadow-sm border border-white/5">
            {/* 🏆 Title + Team Logo centered */}
            <div className="flex flex-col items-center mb-4 border-b border-white/5 pb-2">
                <div className="flex items-center justify-center gap-2">
                    {teamLogo && (
                        <Image
                            src={teamLogo}
                            alt={`${teamName} Logo`}
                            width={24}
                            height={24}
                            className="object-contain"
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
                            className="grid grid-cols-[auto_1fr_auto_1fr] md:grid-cols-4 items-center bg-white/5 border border-transparent p-2 rounded text-xs hover:bg-white/10 transition-colors"
                        >
                            {/* 1️⃣ Date */}
                            <div className="truncate text-gray-500 text-[10px] md:text-xs mr-2">{matchDate}</div>

                            {/* 2️⃣ Home Team */}
                            <div className="truncate font-medium text-right pr-3 text-gray-300">{m.homeTeam.name}</div>

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
                            <div className="truncate font-medium text-left pl-3 text-gray-300">{m.awayTeam.name}</div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default LastFiveMatches;
