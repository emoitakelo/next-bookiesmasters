// app/page.tsx
import FixtureCard from "@/components/FixtureCard";

export const dynamic = "force-dynamic";


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

export default async function HomePage() {
  // Kenya time
  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "Africa/Nairobi",
  });

  // Fetch predictions for today
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/fixtures/cards?date=${today}`,
    { cache: "no-store" }
  );

  const fixtures = await res.json();

  return (
    <main className="px-4 py-4 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">
        Today’s Football Predictions
      </h1>

      <p className="text-gray-700 mb-6">
        Accurate and data-driven football predictions for <strong>{today}</strong>.
        Compare odds, match insights, team form, and betting tips across top
        leagues worldwide.
      </p>

      <div className="space-y-4">
        {fixtures?.length > 0 ? (
fixtures.map((fixture: BackendMatch) => (
            <FixtureCard key={fixture.fixtureId} {...fixture} />
          ))
        ) : (
          <p className="text-gray-600">No fixtures available for today.</p>
        )}
      </div>
    </main>
  );
}
