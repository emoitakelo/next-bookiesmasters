
import React from "react";
import Image from "next/image";

interface LeagueHeaderProps {
    league: string;
    logo?: string;
}

const LeagueHeader: React.FC<LeagueHeaderProps> = ({ league, logo }) => {
    return (
        <div className="flex items-center justify-start gap-2 py-2 px-1">
            {logo && (
                <img
                    src={logo}
                    alt={league}
                    className="w-5 h-5 object-contain opacity-70"
                />
            )}
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                {league}
            </span>
        </div>
    );
};

export default LeagueHeader;
