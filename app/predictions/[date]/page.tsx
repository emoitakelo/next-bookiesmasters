import PredictionsList from "./predictionList";

// Backend types
interface BackendLeague {
  id: number;
  name: string;
  logo: string;
  country: string;
}

interface BackendMatch {
  fixtureId: number;
  status: string;
  score: string | null;
  homeTeam: {
    id: number;
    name: string;
    logo: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
  };
  odds: {
    home: string | null;
    draw: string | null;
    away: string | null;
  };
  league: BackendLeague;
}

interface BackendFixture {
  league: BackendLeague;
  matches: BackendMatch[];
}

interface BackendResponse {
  date: string;
  totalLeagues: number;
  fixtures: BackendFixture[];
}

// Type expected by PredictionsList
export interface LeagueGroup {
  id: number;
  name: string;
  logo: string;
  country: string;
  matches: BackendMatch[];
}

interface Props {
  params: { date: string } | Promise<{ date: string }>;
}

export default async function PredictionsPage(props: Props) {
  const { date } = "then" in props.params ? await props.params : props.params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/fixtures/cards?date=${date}`,
    { cache: "no-store" }
  );

  const backendData: BackendResponse = await res.json();

  // Map backend data to LeagueGroup[] (matches still contain league for internal typing)
  const initialData: LeagueGroup[] = Array.isArray(backendData.fixtures)
    ? backendData.fixtures.map((f) => ({
        id: f.league.id,
        name: f.league.name,
        logo: f.league.logo,
        country: f.league.country,
        matches: f.matches, // keep league inside matches for typing
      }))
    : [];

  return <PredictionsList initialData={initialData} date={date} />;
}
