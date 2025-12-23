"use client";

import React, { useState } from "react";
import Tabs from "@/components/Tabs";
import H2HSection from "@/components/fixture-details/H2HSection";
import LastFiveMatches from "@/components/fixture-details/LastFiveMatches";
import Standings from "@/components/fixture-details/Standings";
import Odds from "@/components/fixture-details/Odds";
import TeamDisplay from "@/components/fixture-details/TeamDisplay";
import LeagueHeader from "@/components/fixture-details/LeagueHeader";

interface FixtureDetailsClientProps {
    data: any;
}

const FixtureDetailsClient: React.FC<FixtureDetailsClientProps> = ({ data }) => {
    const [activeTab, setActiveTab] = useState("h2h");

    const tabs = [
        { id: "h2h", label: "H2H" },
        { id: "last5", label: "Last 5" },
        { id: "standings", label: "Standings" },
        { id: "odds", label: "Odds" },
    ];

    const renderContent = () => {
        switch (activeTab) {
            case "h2h":
                return <H2HSection h2h={data.h2h} />;
            case "last5":
                return (
                    <div className="space-y-6">
                        <LastFiveMatches
                            teamName={data.homeTeam.name}
                            teamLogo={data.homeTeam.logo}
                            matches={data.homeTeam.last5Matches}
                        />
                        <LastFiveMatches
                            teamName={data.awayTeam.name}
                            teamLogo={data.awayTeam.logo}
                            matches={data.awayTeam.last5Matches}
                        />
                    </div>
                );
            case "standings":
                return <Standings standings={data.standings} />;
            case "odds":
                return <Odds odds={data.odds} />;
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen bg-transparent text-white py-4 px-2">
            <div className="max-w-xl mx-auto space-y-4">
                <LeagueHeader league={data.league} logo={data.leagueLogo} />

                <TeamDisplay
                    homeTeam={data.homeTeam}
                    awayTeam={data.awayTeam}
                    status={data.status}
                    displayDate={data.displayDate}
                    venue={data.venue}
                    date={data.date}
                />

                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

                {renderContent()}
            </div>
        </div>
    );
};

export default FixtureDetailsClient;
