import React from 'react';
import FixtureCard, { FixtureCardProps } from '@/components/FixtureCard';

interface LeagueFixturesProps {
    fixtures: FixtureCardProps[];
}

const LeagueFixtures: React.FC<LeagueFixturesProps> = ({ fixtures }) => {
    if (!fixtures || fixtures.length === 0) {
        return <div className="p-4 text-center text-gray-500">No recent fixtures available.</div>;
    }

    return (
        <div className="space-y-2">
            {fixtures.map((fixture) => (
                <FixtureCard key={fixture.fixtureId} {...fixture} />
            ))}
        </div>
    );
};

export default LeagueFixtures;
