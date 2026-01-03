
import React from "react";
import Image from "next/image";

interface LeagueHeaderProps {
    league: string;
    logo?: string;
}

const LeagueHeader: React.FC<LeagueHeaderProps> = ({ league, logo }) => {
    return (
        <div className="flex items-center justify-end gap-2 py-2 px-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {league}
            </span>
            {logo && (
                <img
                    src={logo}
                    alt={league}
                    className="w-4 h-4 object-contain opacity-70"
                />
            )}
        </div>
    );
};

export default LeagueHeader;
