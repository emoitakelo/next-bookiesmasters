
import React from "react";
import Image from "next/image";

interface LeagueHeaderProps {
    league: string;
    logo?: string;
}

const LeagueHeader: React.FC<LeagueHeaderProps> = ({ league, logo }) => (
    <div className="flex flex-col items-center mb-6">
        {logo && (
            <Image
                src={logo}
                alt={league}
                width={40}
                height={40}
                className="mb-2 object-contain"
            />
        )}
        <h2 className="text-xl font-semibold text-teal-600">{league}</h2>
    </div>
);

export default LeagueHeader;
