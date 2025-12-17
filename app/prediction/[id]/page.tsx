
import { notFound } from "next/navigation";
import LeagueHeader from "@/components/fixture-details/LeagueHeader";
import TeamDisplay from "@/components/fixture-details/TeamDisplay";
import H2HSection from "@/components/fixture-details/H2HSection";
import LastFiveMatches from "@/components/fixture-details/LastFiveMatches";
// import PredictionAdvice from "@/components/fixture-details/PredictionAdvice"; // Skipped as per request

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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/fixtures/${id}`, {
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

    return (
        <div className="min-h-screen bg-transparent text-white py-4 px-2">
            <div className="max-w-xl mx-auto space-y-4">
                {/* Back Button (Optional) */}
                {/* <Link href="/" ... > &larr; Back </Link> */}

                <LeagueHeader league={data.league} logo={data.leagueLogo} />

                <TeamDisplay
                    homeTeam={data.homeTeam}
                    awayTeam={data.awayTeam}
                    status={data.status}
                    displayDate={data.displayDate}
                    venue={data.venue}
                    date={data.date}
                />

                {/* Prediction Advice (Skipped) */}
                {/* <PredictionAdvice tip={data.tip} /> */}

                <H2HSection h2h={data.h2h} />

                <LastFiveMatches
                    teamName={data.homeTeam.name}
                    teamLogo={data.homeTeam.logo}
                    matches={data.homeTeam.last5Matches}
                />

                <LastFiveMatches
                    teamName={data.awayTeam.name}
                    teamLogo={data.awayTeam.logo}
                    matches={data.awayTeam.last5Matches}
                />
            </div>
        </div>
    );
}
