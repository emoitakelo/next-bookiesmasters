"use client";

import React from "react";

interface StatItem {
    type: string;
    value: string | number | null;
}

interface TeamStats {
    team: {
        id: number;
        name: string;
        logo: string;
    };
    statistics: StatItem[];
}

interface StatisticsProps {
    stats: TeamStats[];
}

export default function Statistics({ stats }: StatisticsProps) {
    if (!stats || stats.length < 2) {
        return (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow-sm">
                <p>No statistics available yet.</p>
            </div>
        );
    }

    const home = stats[0];
    const away = stats[1];

    // Helper to get value safely
    const getVal = (teamStat: TeamStats, type: string) => {
        const item = teamStat.statistics.find(s => s.type === type);
        return item?.value ?? 0;
    };

    // List of stats to display
    const statTypes = [
        "Ball Possession",
        "Total Shots",
        "Shots on Goal",
        "Shots off Goal",
        "Corner Kicks",
        "Fouls",
        "Yellow Cards",
        "Red Cards",
        "Offsides",
        "Goalkeeper Saves",
        "Passes %"
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 max-w-2xl mx-auto">

            {/* Header / Team Logos */}
            <div className="flex justify-between items-center mb-6 px-4">
                <div className="flex flex-col items-center w-20">
                    <img src={home.team.logo} alt={home.team.name} className="w-10 h-10 mb-2" />
                    <span className="text-xs font-bold text-center truncate w-full">{home.team.name}</span>
                </div>
                <div className="text-gray-400 font-bold text-sm">VS</div>
                <div className="flex flex-col items-center w-20">
                    <img src={away.team.logo} alt={away.team.name} className="w-10 h-10 mb-2" />
                    <span className="text-xs font-bold text-center truncate w-full">{away.team.name}</span>
                </div>
            </div>

            {/* Stats List */}
            <div className="space-y-4">
                {statTypes.map((type) => {
                    // Extract raw values
                    const val1Raw = getVal(home, type);
                    const val2Raw = getVal(away, type);

                    // Normalize for percentages (Possession, Passes)
                    // If string contains '%', parse it
                    const val1Num = typeof val1Raw === 'string' ? parseFloat(val1Raw) : Number(val1Raw);
                    const val2Num = typeof val2Raw === 'string' ? parseFloat(val2Raw) : Number(val2Raw);

                    const total = val1Num + val2Num;
                    const pct1 = total === 0 ? 0 : (val1Num / total) * 100;
                    const pct2 = total === 0 ? 0 : (val2Num / total) * 100;

                    return (
                        <div key={type} className="flex flex-col gap-1">
                            {/* Values & Label */}
                            <div className="flex justify-between text-xs font-semibold text-gray-700 px-1">
                                <span>{val1Raw}</span>
                                <span className="text-gray-500 font-normal">{type}</span>
                                <span>{val2Raw}</span>
                            </div>

                            {/* Bars */}
                            <div className="flex h-2 w-full rounded-full overflow-hidden bg-gray-100">
                                <div
                                    className={`h-full ${val1Num > val2Num ? 'bg-blue-600' : 'bg-blue-300'}`}
                                    style={{ width: `${pct1}%` }}
                                />
                                <div
                                    className={`h-full ${val2Num > val1Num ? 'bg-red-600' : 'bg-red-300'}`}
                                    style={{ width: `${pct2}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
