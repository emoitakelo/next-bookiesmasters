import React from "react";

interface Injury {
    player: {
        id: number;
        name: string;
        photo: string;
        type: string; // "Missing Fixture", "Questionable"
        reason: string; // "Groin Injury", "Suspended"
    };
    team: {
        id: number;
        name: string;
        logo: string;
    };
    fixture: {
        id: number;
        timezone: string;
        date: string;
        timestamp: number;
    };
    league: {
        id: number;
        season: number;
        name: string;
        country: string;
        logo: string;
        flag: string;
    };
}

interface InjuriesProps {
    injuries: Injury[];
}

export default function Injuries({ injuries }: InjuriesProps) {
    if (!injuries || injuries.length === 0) {
        return (
            <div className="p-6 text-center text-gray-500">
                <p>No reported injuries or suspensions.</p>
            </div>
        );
    }

    // Group by Team
    const homeTeamInjuries = injuries.filter((i, index, self) =>
        // Simple grouping by first team found logic or improved logic
        i.team.id === self[0].team.id
    );

    // Actually, let's group dynamically
    const teams = Array.from(new Set(injuries.map(i => i.team.name)));

    return (
        <div className="p-4 space-y-6">
            {teams.map(teamName => {
                const teamInjuries = injuries.filter(i => i.team.name === teamName);
                const teamLogo = teamInjuries[0].team.logo;

                return (
                    <div key={teamName} className="bg-[#1F1F1F] rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-3 mb-4 pb-2 border-b border-[#333]">
                            <img src={teamLogo} alt={teamName} className="w-8 h-8 object-contain" />
                            <h3 className="font-bold text-lg text-white">{teamName}</h3>
                        </div>

                        <div className="space-y-3">
                            {teamInjuries.map((injury, idx) => (
                                <div key={idx} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={injury.player.photo}
                                            alt={injury.player.name}
                                            className="w-10 h-10 rounded-full bg-gray-800 object-cover"
                                        />
                                        <div>
                                            <p className="font-semibold text-white">{injury.player.name}</p>
                                            <p className="text-xs text-red-400">{injury.player.type}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-2 py-1 bg-red-900/30 text-red-500 text-xs rounded border border-red-900">
                                            {injury.player.reason}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
