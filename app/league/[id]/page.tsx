import LeagueDetailsClient from "@/components/league/LeagueDetailsClient";

export default async function LeaguePage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ name?: string; logo?: string }>;
}) {
    const { id } = await params;
    const { name = "League Details", logo = "" } = await searchParams;

    return (
        <LeagueDetailsClient
            id={Number(id)}
            name={name}
            logo={logo}
        />
    );
}
