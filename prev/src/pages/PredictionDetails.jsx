import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import LeagueHeader from "../components/predictions/LeagueHeader";
import TeamDisplay from "../components/predictions/TeamDisplay";
// import MatchInfo from "../components/predictions/MatchInfo";
import PredictionAdvice from "../components/predictions/PredictionAdvice";
import H2HSection from "../components/predictions/H2HSection";
import LastFiveMatches from "../components/predictions/LastFiveMatches";
import Loader from "../../../frontend-next/components/common/Loader"; // ✅ Import Loader

const PredictionDetails = () => {
  const { fixtureId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axiosInstance.get(`/predictions/details/${fixtureId}`);
        if (res.data.success) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("❌ Error fetching prediction details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [fixtureId]);

  if (loading) return <Loader size={10} color="teal-500" height="h-60" />;

  if (!data)
    return (
      <div className="text-center text-red-500 mt-10">
        No prediction details found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 text-gray-900">
      <LeagueHeader league={data.league} />
      <TeamDisplay fixture={data} />
      {/* <MatchInfo venue={data.venue} /> */}
      <PredictionAdvice tip={data.tip} />
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
  );
};

export default PredictionDetails;
