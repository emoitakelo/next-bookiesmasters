"use client";

import React, { useState } from "react";
import useSWR from "swr";
import Standings from "@/components/fixture-details/Standings";
import TopScorers from "./TopScorers";
import LeagueFixtures from "./LeagueFixtures";

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
        <div className="w-full max-w-4xl mx-auto mt-12 bg-zinc-950/50 rounded-2xl border border-zinc-800/50 overflow-hidden shadow-2xl">

            {/* Header / Title */}
            <div className="p-6 border-b border-zinc-800">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <span className="text-orange-500">🏆</span> League Explorer
                </h2>
            </div>

            {/* League Selector (Tabs) */}
            <div className="flex overflow-x-auto p-4 gap-4 scrollbar-hide bg-zinc-900/30 border-b border-zinc-800">
                {LEAGUES.map((league) => (
                    <button
                        key={league.id}
                        onClick={() => setActiveLeague(league.id)}
                        className={`flex flex-col items-center gap-2 min-w-[80px] p-3 rounded-xl transition-all ${activeLeague === league.id
                                ? "bg-zinc-800 ring-1 ring-orange-500/50 shadow-lg scale-105"
                                : "hover:bg-zinc-800/50 hover:scale-105 opacity-70 hover:opacity-100"
                            }`}
                    >
                        <img src={league.logo} alt={league.name} className="w-10 h-10 object-contain drop-shadow-md" />
                        <span className={`text-[10px] font-medium whitespace-nowrap ${activeLeague === league.id ? 'text-white' : 'text-gray-400'}`}>
                            {league.name}
                        </span>
                    </button>
                ))}
            </div>

            {/* Content Tabs (Standings | Scorers | Fixtures) */}
            <div className="flex border-b border-zinc-800 bg-zinc-900/20">
                {[
                    { id: "standings", label: "📊 Standings" },
                    { id: "fixtures", label: "📅 Fixtures" },
                    { id: "topscorers", label: "⚽ Top Scorers" },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex-1 py-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === tab.id
                                ? "text-orange-400 bg-zinc-900/50"
                                : "text-gray-500 hover:text-gray-300 hover:bg-zinc-900/30"
                            }`}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-orange-500/80 shadow-[0_-2px_8px_rgba(249,115,22,0.4)]" />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-4 min-h-[400px] bg-zinc-950">
                {activeTab === "standings" && (
                    standings?.standings ? <Standings standings={standings.standings} /> : <LoadingState />
                )}

                {activeTab === "topscorers" && (
                    scorers?.players ? <TopScorers scorers={scorers.players} /> : <LoadingState />
                )}

                {activeTab === "fixtures" && (
                    fixtures ? <LeagueFixtures fixtures={fixtures} /> : <LoadingState />
                )}
            </div>

        </div>
    );
}

function LoadingState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-gray-500 animate-pulse">
            <div className="w-10 h-10 border-4 border-zinc-800 border-t-orange-500 rounded-full animate-spin"></div>
            <p className="text-xs font-medium tracking-wider">LOADING DATA...</p>
        </div>
    );
}
