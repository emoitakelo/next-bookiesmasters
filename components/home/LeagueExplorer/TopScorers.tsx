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
        <div className="bg-zinc-900 rounded-lg p-4">
            <div className="space-y-4">
                {scorers.slice(0, 10).map((scorer) => (
                    <div key={scorer.rank} className="flex items-center justify-between border-b border-zinc-800 pb-3 last:border-0 last:pb-0">

                        {/* Left: Rank & Player Info */}
                        <div className="flex items-center gap-4">
                            <span className={`w-6 text-center font-bold ${scorer.rank === 1 ? 'text-yellow-400' :
                                    scorer.rank <= 3 ? 'text-gray-300' : 'text-gray-500'
                                }`}>
                                {scorer.rank}
                            </span>

                            <div className="relative">
                                <img
                                    src={scorer.player.photo}
                                    alt={scorer.player.name}
                                    className="w-10 h-10 rounded-full object-cover bg-gray-800"
                                />
                                <img
                                    src={scorer.team.logo}
                                    alt={scorer.team.name}
                                    className="w-4 h-4 absolute -bottom-1 -right-1 rounded-full bg-zinc-900 p-0.5"
                                />
                            </div>

                            <div>
                                <p className="font-bold text-white text-sm">{scorer.player.name}</p>
                                <p className="text-xs text-gray-400">{scorer.team.name}</p>
                            </div>
                        </div>

                        {/* Right: Goals */}
                        <div className="text-right">
                            <p className="font-bold text-main-accent text-lg">{scorer.statistics.goals.total}</p>
                            <p className="text-[10px] text-gray-500 uppercase">Goals</p>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopScorers;
