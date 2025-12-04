// types/fixture.ts
export type Nullable<T> = T | null;

export interface Team {
  id: number;
  name: string;
  logo?: string | null;
}

export interface Odds {
  home?: string | null;
  draw?: string | null;
  away?: string | null;
  // keep open for future bookmaker metadata
 [key: string]: string | null | undefined;

}

export interface MatchCard {
  fixtureId: number;
  status: string;           // "FT", "50'", "15:00", etc (already formatted by backend)
  score?: string | null;    // "1 - 0" or null
  league?: {
    id: number;
    name: string;
    logo?: string | null;
    country?: string | null;
  };
  homeTeam: Team;
  awayTeam: Team;
  odds: Odds;
}

export interface LeagueGroup {
  league: {
    id: number;
    name: string;
    logo?: string | null;
    country?: string | null;
  };
  matches: MatchCard[];      // matches array (your backend uses `matches` in each league group)
}

/**
 * The shape your backend returns for /api/fixtures/cards?date=YYYY-MM-DD
 * {
 *   date: "2025-11-30",
 *   totalLeagues: 5,
 *   fixtures: LeagueGroup[]
 * }
 */
export interface FixturesResponse {
  date: string;
  totalLeagues: number;
  fixtures: LeagueGroup[];
}
