import PredictionsList from "./predictionList";
import DateNavigator from "@/components/DateNavigator";



export const revalidate = 30; // ISR (regenerates every 60 seconds)

// ---------------------
// Backend Types
// ---------------------
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

// Type expected by the component
export interface LeagueGroup {
  id: number;
  name: string;
  logo: string;
  country: string;
  matches: BackendMatch[];
}

// ---------------------
// PAGE COMPONENT
// ---------------------
export default async function PredictionsPage({
  params,
}: {
  params: { date?: string };
}) {
  let date = params?.date;

  // If no date is provided (e.g. homepage route) → ALWAYS use today's Kenya date
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

  const initialData: LeagueGroup[] = backendData.fixtures.map((f) => ({
    id: f.league.id,
    name: f.league.name,
    logo: f.league.logo,
    country: f.league.country,
    matches: f.matches,
  }));

return (
    <>
      <DateNavigator date={date} />

      <PredictionsList initialData={initialData} date={date} />
    </>
  );}
