"use client";

import useSWR from "swr";
import Image from "next/image";
import FixtureCard from "@/components/FixtureCard";

// ------------------------------
// TYPES BASED ON YOUR BACKEND RESPONSE
// ------------------------------
export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Odds {
  home: string | null;
  draw: string | null;
  away: string | null;
}

export interface FixtureCardProps {
  fixtureId: number;
  status: string;
  score: string | null;
  league: {
    id: number;
    name: string;
    logo: string;
    country: string;
  };
  homeTeam: Team;
  awayTeam: Team;
  odds: Odds;
}

export interface LeagueGroup {
  id: number;
  name: string;
  logo: string;
  country: string;
  matches: FixtureCardProps[];
}

// ------------------------------
// SWR FETCHER
// ------------------------------
const fetcher = (url: string): Promise<LeagueGroup[]> =>
  fetch(url, { cache: "no-store" }).then(res => res.json());

// ------------------------------
// COMPONENT PROPS
// ------------------------------
interface PredictionsListProps {
  initialData: LeagueGroup[];
  date: string;
}

// ------------------------------
// MAIN COMPONENT
// ------------------------------
export default function PredictionsList({
  initialData,
  date,
}: PredictionsListProps) {
  const { data } = useSWR<LeagueGroup[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/fixtures/cards?date=${date}`,
    fetcher,
    {
      refreshInterval: 30000,   // auto-update every 30s
      fallbackData: initialData,
      revalidateOnFocus: false,
      dedupingInterval: 0,
    }
  );

  // ensure always array
  const safeData: LeagueGroup[] = Array.isArray(data) ? data : initialData;

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">
      {safeData.length === 0 && (
        <p className="text-center py-8 text-gray-500">
          No fixtures available for this date.
        </p>
      )}

      {safeData.map((league, idx) => (
        <div key={league.id || idx}>
          <div className="flex items-center gap-1 ">
            {league.logo && (
              <Image
                src={league.logo}
                alt={league.name}
                width={20}
                height={20}
                className="w-5 h-5"
              />
            )}
            <div className="flex flex-col">
  <span className="font-semibold text-sm text-gray-300">{league.name}</span>
  <span className="text-xs text-gray-400">{league.country}</span>
</div>

          </div>

          <div className="space-y-2">
            {league.matches.map((fixture) => (
              <FixtureCard key={fixture.fixtureId} {...fixture} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
