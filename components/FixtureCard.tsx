"use client";

import Image from "next/image";
import Link from "next/link";

export interface Odds {
  home: string | null;
  draw: string | null;
  away: string | null;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface FixtureCardProps {
  fixtureId: number;
  status: string;
  homeTeam: Team;
  awayTeam: Team;
  odds: Odds;
  score: string | null;
}

export default function FixtureCard({
  fixtureId,
  status,
  homeTeam,
  awayTeam,
  odds,
  score,
}: FixtureCardProps) {
  const isLive = status.includes("'");

  return (
    <Link href={`/predictions/${fixtureId}`} className="block">
      <div
        className={`max-w-xl mx-auto bg-white rounded-xl shadow-sm hover:shadow-md transition flex items-center justify-evenly p-2 border-l-4 ${
          isLive ? "border-red-500 animate-pulse" : "border-transparent"
        }`}
      >
        {/* STATUS */}
        <div className="w-[45px] sm:w-[55px] text-left">
          <p
            className={`text-xs sm:text-xs leading-none ${
              isLive ? "text-red-600 font-medium" : "text-gray-600 font-medium"
            }`}
          >
            {status}
          </p>
        </div>

        {/* TEAMS */}
        <div className="flex flex-col items-start text-left mx-2 w-[150px] sm:w-[200px]">
          <div className="flex items-center gap-2">
            <Image
              src={homeTeam.logo}
              alt={homeTeam.name}
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="font-medium text-gray-800 text-xs sm:text-sm truncate">
              {homeTeam.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src={awayTeam.logo}
              alt={awayTeam.name}
              width={16}
              height={16}
              className="w-4 h-4"
            />
            <span className="font-medium text-gray-800 text-xs sm:text-sm truncate">
              {awayTeam.name}
            </span>
          </div>
        </div>

        {/* ODDS */}
        <div className="flex flex-col text-center w-[50px] sm:w-[60px]">
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            {odds.home ?? "-"}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            {odds.draw ?? "-"}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-gray-700">
            {odds.away ?? "-"}
          </span>
        </div>

        {/* SCORE */}
        <div
          className={`text-right font-medium text-xs sm:text-sm flex flex-col justify-center items-center w-[35px] sm:w-[45px] ${
            isLive ? "text-red-600" : "text-gray-800"
          }`}
        >
          {score ? (
            <>
              <span>{score.split(" - ")[0]}</span>
              <span>{score.split(" - ")[1]}</span>
            </>
          ) : (
            <>
              <span> </span>
              <span> </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
