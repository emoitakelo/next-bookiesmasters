
import React from "react";
import Image from "next/image";

interface Team {
    id: number;
    name: string;
    logo: string;
    form?: { result: string; color: string }[];
    last5Matches?: any[];
}

interface TeamDisplayProps {
    homeTeam: Team;
    awayTeam: Team;
    status: string;
    // displayDate usually contains time or "FT"
    displayDate: string;
    venue?: string;
    date: string; // ISO date string
    score?: { home: number | null; away: number | null };
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({
    homeTeam,
    awayTeam,
    status,
    displayDate,
    venue,
    score,
}) => {
    // Check if match is live/active to apply red color
    const isLive = ["1H", "HT", "2H", "ET", "BT", "P", "LIVE"].includes(status);
    const isFinished = ["FT", "AET", "PEN"].includes(status);

    const renderFormBars = (forms: { result: string; color: string }[]) => {
        if (!forms || !Array.isArray(forms) || forms.length === 0) return null;

        return (
            <div className="flex justify-center gap-1 mt-1">
                {forms.map((m, idx) => (
                    <span
                        key={idx}
                        className="rounded-sm text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center"
                        style={{ backgroundColor: m.color }}
                    >
                        {m.result}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center mb-3 text-white bg-[#1F1F1F] p-2 rounded-xl shadow-sm border border-white/5">
            {/* League/Header info is usually above this component, so we just show teams here */}

            <div className="grid grid-cols-3 items-center gap-1 sm:gap-2 max-w-lg w-full">
                {/* Home */}
                <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2">
                        <Image
                            src={homeTeam?.logo}
                            alt={homeTeam?.name}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <span className="font-bold text-center text-xs sm:text-sm text-gray-200 leading-tight">
                        {homeTeam.name}
                    </span>
                    {homeTeam.form && renderFormBars(homeTeam.form)}
                </div>

                {/* Center - Score/Time */}
                <div className="flex flex-col items-center justify-center text-center">
                    {score ? (
                        <div className="flex flex-col items-center">
                            {/* Score */}
                            <div className={`text-2xl sm:text-3xl font-bold tracking-wider ${isLive ? "text-red-500" : "text-gray-200"}`}>
                                {score.home} - {score.away}
                            </div>

                            {/* Status / Date */}
                            <div className={`text-xs font-bold mt-1 ${isLive ? "text-red-500 animate-pulse" : "text-gray-400"}`}>
                                {isFinished ? "Full Time" : displayDate}
                            </div>
                        </div>
                    ) : (
                        <div className="text-sm font-bold text-gray-400">
                            {displayDate}
                        </div>
                    )}
                </div>

                {/* Away */}
                <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-2">
                        <Image
                            src={awayTeam?.logo}
                            alt={awayTeam?.name}
                            fill
                            className="object-contain"
                            unoptimized
                        />
                    </div>
                    <span className="font-bold text-center text-xs sm:text-sm text-gray-200 leading-tight">
                        {awayTeam.name}
                    </span>
                    {awayTeam.form && renderFormBars(awayTeam.form)}
                </div>
            </div>

            {venue && (
                <p className="mt-4 text-gray-500 text-[10px] sm:text-xs text-center border-t border-white/10 pt-2 w-full max-w-xs">
                    🏟 {venue}
                </p>
            )}
        </div>
    );
};

export default TeamDisplay;
