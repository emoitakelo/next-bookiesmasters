
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
}

const TeamDisplay: React.FC<TeamDisplayProps> = ({
    homeTeam,
    awayTeam,
    status,
    displayDate,
    venue,
}) => {
    const renderFormBars = (forms: { result: string; color: string }[]) => {
        if (!forms || !Array.isArray(forms) || forms.length === 0) return null;

        return (
            <div className="flex justify-center gap-1 mt-1">
                {forms.map((m, idx) => (
                    <span
                        key={idx}
                        className="px-1 py-1 rounded text-white text-xs font-bold w-5 h-5 flex items-center justify-center"
                        style={{ backgroundColor: m.color }}
                    >
                        {m.result}
                    </span>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center mb-8 text-gray-800 bg-white p-4 rounded-lg shadow-sm">
            <h2 className="text-lg sm:text-xl font-semibold mb-6 text-center text-gray-700">
                {homeTeam?.name} vs {awayTeam?.name}
            </h2>

            <div className="grid grid-cols-3 items-center gap-4 sm:gap-6 max-w-2xl w-full">
                {/* Home */}
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
                        <Image
                            src={homeTeam?.logo}
                            alt={homeTeam?.name}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold text-center text-sm md:text-base">{homeTeam.name}</span>
                    {homeTeam.form && renderFormBars(homeTeam.form)}
                </div>

                {/* Center */}
                <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-sm sm:text-lg font-bold text-gray-600 mb-2">
                        {status === "FT" ? "Full Time" : displayDate}
                    </div>
                </div>

                {/* Away */}
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
                        <Image
                            src={awayTeam?.logo}
                            alt={awayTeam?.name}
                            fill
                            className="object-contain"
                        />
                    </div>
                    <span className="font-bold text-center text-sm md:text-base">{awayTeam.name}</span>
                    {awayTeam.form && renderFormBars(awayTeam.form)}
                </div>
            </div>

            {venue && (
                <p className="mt-6 text-gray-500 text-sm text-center italic border-t pt-2 w-full max-w-md">
                    🏟 {venue}
                </p>
            )}
        </div>
    );
};

export default TeamDisplay;
