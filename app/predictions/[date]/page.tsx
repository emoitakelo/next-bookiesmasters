import PredictionsList from "./predictionList";

export const dynamic = "force-dynamic"; // 🔥 Important (no caching)

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

export interface LeagueGroup {
  id: number;
  name: string;
  logo: string;
  country: string;
  matches: BackendMatch[];
}

interface Props {
  params: { date?: string };
}

export default async function PredictionsPage({ params }: Props) {
  let date = params?.date;

  // 🔥 If no date is passed → ALWAYS use today's Kenya date
  if (!date) {
    date = new Date().toLocaleDateString("en-CA", {
      timeZone: "Africa/Nairobi",
    });
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/fixtures/cards?date=${date}`,
    { cache: "no-store" }
  );

  const backendData: BackendResponse = await res.json();

  const initialData: LeagueGroup[] = Array.isArray(backendData.fixtures)
    ? backendData.fixtures.map((f) => ({
        id: f.league.id,
        name: f.league.name,
        logo: f.league.logo,
        country: f.league.country,
        matches: f.matches,
      }))
    : [];

  return <PredictionsList initialData={initialData} date={date} />;
}
