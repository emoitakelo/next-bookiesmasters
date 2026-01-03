import React from 'react';

interface Scorer {
    rank: number;
    player: {
        name: string;
        photo: string;
    };
    team: {
        name: string;
        logo: string;
    };
    statistics: {
        goals: {
            total: number;
            assists: number;
        };
        games: {
            appearences: number;
        };
    };
}

interface TopScorersProps {
    scorers: Scorer[];
}

const TopScorers: React.FC<TopScorersProps> = ({ scorers }) => {
    if (!scorers || scorers.length === 0) {
        return <div className="p-4 text-center text-gray-500">No top scorers data available.</div>;
    }


    return (
        <div className="bg-[#1F1F1F] rounded-xl p-3 border border-white/5">
            <div className="space-y-2">
                {scorers.slice(0, 10).map((scorer) => (
                    <div key={scorer.rank} className="flex items-center justify-between py-1 hover:bg-white/5 rounded px-1 transition-colors">

                        {/* Left: Rank & Player Info */}
                        <div className="flex items-center gap-3">
                            <span className={`w-5 text-center font-bold text-xs ${scorer.rank === 1 ? 'text-yellow-400' :
                                scorer.rank <= 3 ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                {scorer.rank}
                            </span>

                            <div className="relative">
                                <img
                                    src={scorer.player.photo}
                                    alt={scorer.player.name}
                                    className="w-8 h-8 rounded-full object-cover bg-gray-800"
                                />
                                <img
                                    src={scorer.team.logo}
                                    alt={scorer.team.name}
                                    className="w-3.5 h-3.5 absolute -bottom-1 -right-1 rounded-full bg-[#1F1F1F] p-0.5"
                                />
                            </div>

                            <div>
                                <p className="font-bold text-gray-200 text-xs">{scorer.player.name}</p>
                                <p className="text-[10px] text-gray-400">{scorer.team.name}</p>
                            </div>
                        </div>

                        {/* Right: Goals */}
                        <div className="text-right">
                            <p className="font-bold text-red-500 text-sm">{scorer.statistics.goals.total}</p>
                            <p className="text-[9px] text-gray-500 uppercase">Goals</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopScorers;
