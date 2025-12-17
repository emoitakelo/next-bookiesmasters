export const calculateTip = (prediction, teams) => {
  const winner = prediction?.predictions?.winner;
  const winOrDraw = prediction?.predictions?.win_or_draw; // ✅ correct place
  const homeTeam = teams?.home?.name;
  const awayTeam = teams?.away?.name;

  if (!winner?.name || typeof winOrDraw === "undefined") {
    return null;
  }

  if (winOrDraw === true) {
    return winner.name === homeTeam ? "1X" : "X2";
  } else {
    return winner.name === homeTeam ? "1" : "2";
  }
};
