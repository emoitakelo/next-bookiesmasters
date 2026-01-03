"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Standings from "@/components/fixture-details/Standings";
import TopScorers from "./TopScorers";
import LeagueFixtures from "./LeagueFixtures";
import Loader from "@/components/Loader";

// Hardcoded Big 6 Leagues
const LEAGUES = [
    { id: 39, name: "Premier League", logo: "https://media.api-sports.io/football/leagues/39.png" },
    { id: 140, name: "La Liga", logo: "https://media.api-sports.io/football/leagues/140.png" },
    { id: 78, name: "Bundesliga", logo: "https://media.api-sports.io/football/leagues/78.png" },
    { id: 135, name: "Serie A", logo: "https://media.api-sports.io/football/leagues/135.png" },
    { id: 61, name: "Ligue 1", logo: "https://media.api-sports.io/football/leagues/61.png" },
    { id: 2, name: "Champions League", logo: "https://media.api-sports.io/football/leagues/2.png" },
];

const fetcher = (url: string) => fetch(url).then(res => res.json()).then(json => json.data);

export default function LeagueExplorer() {
    const [activeLeague, setActiveLeague] = useState(LEAGUES[0].id);
    const [activeTab, setActiveTab] = useState<"fixtures" | "standings" | "topscorers">("standings");

    // Fetch Data based on active tab & league
    // We use different endpoints depending on the tab to save bandwidth

    // 1. Standings
    const { data: standings } = useSWR(
        activeTab === "standings" ? `${process.env.NEXT_PUBLIC_API_URL}/api/leagues/${activeLeague}/standings` : null,
        fetcher
    );

    // 2. Top Scorers
    const { data: scorers } = useSWR(
        activeTab === "topscorers" ? `${process.env.NEXT_PUBLIC_API_URL}/api/leagues/${activeLeague}/topscorers` : null,
        fetcher
    );

    // 3. Fixtures
    const { data: fixtures } = useSWR(
        activeTab === "fixtures" ? `${process.env.NEXT_PUBLIC_API_URL}/api/leagues/${activeLeague}/fixtures` : null,
        fetcher
    );

    return (
        <div className="w-full max-w-xl mx-auto mt-6 bg-transparent">

            {/* League Selector (Tabs) */}
            {/* League Selector (Tabs) */}
            <div className="flex overflow-x-auto p-2 gap-2 scrollbar-hide mb-2 bg-[#1F1F1F] rounded-xl border border-white/5">
                {LEAGUES.map((league) => (
                    <button
                        key={league.id}
                        onClick={() => setActiveLeague(league.id)}
                        className={`flex flex-col items-center gap-1.5 min-w-[70px] p-2 rounded-lg transition-all ${activeLeague === league.id
                            ? "opacity-100"
                            : "opacity-50 hover:opacity-100"
                            }`}
                    >
                        <img src={league.logo} alt={league.name} className="w-8 h-8 object-contain" />
                        <span className={`text-[10px] font-bold text-center leading-tight ${activeLeague === league.id ? 'text-gray-200' : 'text-gray-500'}`}>
                            {league.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content Tabs (Standings | Scorers | Fixtures) */}
            <div className="flex border-b border-white/5 bg-[#1F1F1F] rounded-t-xl overflow-hidden mx-1">
                {[
                    { id: "standings", label: "Standings" },
                    { id: "fixtures", label: "Fixtures" },
                    { id: "topscorers", label: "Top Scorers" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-3 text-xs font-medium transition-colors relative ${activeTab === tab.id
                            ? "text-gray-200 bg-white/5"
                            : "text-gray-400 hover:text-gray-300 hover:bg-white/5"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-red-500 shadow-[0_-2px_8px_rgba(239,68,68,0.4)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-0 min-h-[300px] bg-transparent mt-2">
                {activeTab === "standings" && (
                    <div className="pt-2">
                        {standings?.standings ? <Standings standings={standings.standings} /> : <Loader />}
                    </div>
                )}

                {activeTab === "topscorers" && (
                    <div className="pt-2">
                        {scorers?.players ? <TopScorers scorers={scorers.players} /> : <Loader />}
                    </div>
                )}

                {activeTab === "fixtures" && (
                    <div className="pt-2">
                        {fixtures ? <LeagueFixtures fixtures={fixtures} /> : <Loader />}
                    </div>
                )}
            </div>

        </div>
    );
}
