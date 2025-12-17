import React from "react";
import LeagueGroup from "./LeagueGroup";
import PredictionCard from "./PredictionCard";

const PredictionList = ({ predictions, isLoading }) => {
  // If still loading, render nothing (so "No predictions" can't flash)
  if (isLoading) return null;

  // After loading finished, show "No predictions" only when empty
  if (!predictions || predictions.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-4">
        No predictions available for this date.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      
      {predictions.map((leagueData, index) => (
        <LeagueGroup
          key={index}
          league={leagueData.league}
          leagueLogo={leagueData.leagueLogo}
          country={leagueData.country}
        >
          {leagueData.fixtures.map((fixture) => (
            <PredictionCard key={fixture.fixtureId} fixture={fixture} />
          ))}
        </LeagueGroup>
      ))}
    </div>
  );
};

export default PredictionList;
