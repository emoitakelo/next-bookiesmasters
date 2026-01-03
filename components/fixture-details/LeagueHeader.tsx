
import React from "react";
import Image from "next/image";

interface LeagueHeaderProps {
    league: string;
    logo?: string;
    country?: string;
    id?: number;
}

import Link from "next/link";

const LeagueHeader: React.FC<LeagueHeaderProps> = ({ league, logo, country, id }) => {
    const content = (
        <div className="flex items-center justify-start gap-2 py-1 px-1 group cursor-pointer">
            {logo && (
                <img
                    src={logo}
                    alt={league}
                    className="w-6 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
            )}
            <div className="flex flex-col items-start leading-none gap-0.5">
                <span className="text-sm font-bold text-gray-200 tracking-widest group-hover:text-orange-400 transition-colors">
                    {league}
                </span>
                {country && (
                    <span className="text-[10px] font-medium text-gray-500">
                        {country}
                    </span>
                )}
            </div>
        </div>
    );

    if (id) {
        return <Link href={`/league/${id}`}>{content}</Link>;
    }

    return content;
};

export default LeagueHeader;
