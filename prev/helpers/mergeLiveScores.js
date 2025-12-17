export const mergeLiveScores = (predictions, liveScores) => {
  return predictions.map(pred => {
    const live = liveScores.find(l => l.fixtureId === pred.fixtureId);

    if (live) {
      return {
        ...pred,
        fixture: {
          ...pred.fixture,
          status: live.status.short,
          elapsed: live.status.elapsed,
        },
        homeTeam: {
          ...pred.homeTeam,
          score: live.goals.home ?? pred.homeTeam?.score ?? 0,
        },
        awayTeam: {
          ...pred.awayTeam,
          score: live.goals.away ?? pred.awayTeam?.score ?? 0,
        },
        predictions: {
          ...pred.predictions,
          goals: {
            home: (live.goals.home ?? pred.predictions?.goals?.home ?? 0).toString(),
            away: (live.goals.away ?? pred.predictions?.goals?.away ?? 0).toString(),
          },
        },
      };
    }

    return pred;
  });
};
