import { notFound } from "next/navigation";
import FixtureDetailsClient from "./FixtureDetailsClient";

// Enable ISR with 1-second regeneration (matches Homepage speed)
export const revalidate = 1;

// Note: dynamicParams = true is default, so we don't need to force-dynamic

interface FixtureDetailData {
    fixtureId: number;
    league: string;
    leagueLogo: string;
    date: string;
    displayDate: string;
    status: string;
    venue: string;
    tip: string;
    homeTeam: any;
    awayTeam: any;
    h2h: any[];
}

// --------------------------------------------------------------------------
// GENERATE STATIC PARAMS (Pre-build today's active matches for instant load)
// --------------------------------------------------------------------------
export async function generateStaticParams() {
    try {
        // 1. Get Today's Date in Kenya Time
        const today = new Date().toLocaleDateString("en-CA", {
            timeZone: "Africa/Nairobi",
        });

        // 2. Fetch all fixture IDs for today from our own API
        // Note: During build, this hits the backend. Ensure backend is running or use a direct DB call if preferred.
        // For simplicity/safety in this setup, we try fetch. If it fails (backend not running), we return empty [].
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fixtures/cards?date=${today}`, {
            next: { revalidate: 60 }
        });

        if (!res.ok) return [];

        const json = await res.json();
        const fixtures = json.fixtures || [];

        // 3. Extract IDs. The API returns grouped by league, so we flatten matches.
        // Structure: [ { league:..., matches: [ { fixtureId: 100 }, ... ] }, ... ]
        const paths: { id: string }[] = [];

        fixtures.forEach((group: any) => {
            if (group.matches) {
                group.matches.forEach((m: any) => {
                    if (m.fixtureId) {
                        paths.push({ id: String(m.fixtureId) });
                    }
                });
            }
        });

        // Best Practice: Pre-build the top 50 matches (Instant).
        // The rest are built on-demand (Fast ~0.5s thanks to DB indexes).
        return paths.slice(0, 50);

    } catch (error) {
        console.error("⚠️ generateStaticParams failed (Backend likely down):", error);
        return [];
    }
}

async function getFixture(id: string) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/fixtures/${id}`;
    console.log("🔍 Fetching URL:", url); // <--- DEBUG LOG
    const res = await fetch(url, {
        next: { revalidate: 1 }, // ISR: Cache for 1 second (Fast load + Fresh data)
    });

    if (!res.ok) {
        // If backend is down or errors during build, don't crash the whole build.
        // Just return null, which will trigger notFound() in the component.
        console.error(`⚠️ Failed to fetch details for ${id}. Status: ${res.status}`);
        return null;
    }

    const json = await res.json();
    return json.data as FixtureDetailData; // 'data' wrapper from controller
}

export default async function FixtureDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const data = await getFixture(id);

    if (!data) {
        notFound();
    }

    return <FixtureDetailsClient data={data} />;
}
