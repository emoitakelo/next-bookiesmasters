import React from "react";

interface OddValue {
    value: string;
    odd: string;
}

interface Market {
    id: number;
    name: string;
    values: OddValue[];
}

interface Bookmaker {
    bookmaker: string;
    markets: Market[];
}

interface OddsProps {
    odds: Bookmaker[];
}

const Odds: React.FC<OddsProps> = ({ odds }) => {
    if (!odds || odds.length === 0) {
        return (
            <div className="text-center p-4 text-gray-400 bg-zinc-900 rounded-lg">
                No odds available
            </div>
        );
    }

    // Since we only fetch one bookmaker (Bet365), we can focus on the first item
    const bet365 = odds[0];

    return (
        <div className="space-y-6">
            <div className="bg-zinc-900 rounded-lg p-4">
                <h3 className="text-gray-200 font-semibold mb-3 px-2 flex items-center justify-between">
                    <span>{bet365.bookmaker} Odds</span>
                    <span className="text-xs text-gray-500 font-normal">All markets</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {bet365.markets.map((market) => (
                        <div key={market.id} className="bg-zinc-800/50 rounded-md p-3">
                            <h4 className="text-sm font-medium text-gray-300 mb-2 truncate">
                                {market.name}
                            </h4>
                            <div className="space-y-1">
                                {market.values.map((val, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm py-1 border-b border-zinc-700/50 last:border-0">
                                        <span className="text-gray-400">{val.value}</span>
                                        <span className="font-bold text-green-400">{val.odd}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Odds;
