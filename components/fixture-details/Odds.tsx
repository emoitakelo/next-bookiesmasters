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

import AffiliateButton from "./AffiliateButton";

// Placeholder affiliate links - YOU SHOULD REPLACE THESE WITH REAL ONES
const BOOKMAKER_LINKS: Record<string, string> = {
    "Bet365": "https://www.bet365.com/",
    "1xBet": "https://1xbet.com/",
    "Unibet": "https://www.unibet.com/"
};

interface OddsProps {
    odds: Bookmaker[];
}

const Odds: React.FC<OddsProps> = ({ odds }) => {
    if (!odds || odds.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                <p className="text-sm">No markets available</p>
                <div className="mt-4">
                    <AffiliateButton bookmakerName="Bet365" link="https://www.bet365.com/" />
                </div>
            </div>
        );
    }

    // We focus on the first bookmaker (usually Bet365)
    const bookmakerData = odds[0];
    const affiliateLink = BOOKMAKER_LINKS[bookmakerData.bookmaker] || "https://www.bet365.com/";

    // Helper to determine grid columns based on number of outcomes
    const getGridClass = (valuesCount: number) => {
        if (valuesCount === 2) return "grid-cols-2";
        if (valuesCount === 3) return "grid-cols-3";
        return "grid-cols-2"; // default fallback
    };

    return (
        <div className="space-y-4">
            <AffiliateButton
                bookmakerName={bookmakerData.bookmaker}
                link={affiliateLink}
            />

            {bookmakerData.markets.map((market) => (
                <div key={market.id} className="bg-[#1e1e1e] rounded-lg overflow-hidden border border-[#2a2a2a]">
                    <div className="bg-[#252525] px-4 py-2.5 border-b border-[#333]">
                        <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wide">
                            {market.name}
                        </h3>
                    </div>

                    <div className="p-3">
                        <div className={`grid ${getGridClass(market.values.length)} gap-2`}>
                            {market.values.map((val, idx) => (
                                <div
                                    key={idx}
                                    className="flex flex-col items-center justify-center bg-[#2a2a2a] hover:bg-[#333] active:bg-[#404040] transition-colors rounded py-2 px-1 cursor-pointer group"
                                >
                                    <span className="text-[11px] text-gray-400 font-medium mb-0.5 group-hover:text-gray-300">
                                        {val.value}
                                    </span>
                                    <span className="text-[13px] font-bold text-yellow-500 group-hover:text-yellow-400">
                                        {val.odd}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Odds;
