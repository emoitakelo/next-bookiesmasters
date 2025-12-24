import { notFound } from "next/navigation";
import FixtureDetailsClient from "./FixtureDetailsClient";

// Force dynamic rendering since we fetch fresh data
export const dynamic = "force-dynamic";

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

async function getFixture(id: string) {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/fixtures/${id}`;
    console.log("🔍 Fetching URL:", url); // <--- DEBUG LOG
    const res = await fetch(url, {
        cache: "no-store",
    });

    if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch fixture details");
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
