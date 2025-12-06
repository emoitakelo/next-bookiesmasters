export function formatFixtureCard(fixtureDoc) {
  const fx = fixtureDoc.fixture;

  // -----------------------------
  // STATUS HANDLING
  // -----------------------------
 // -----------------------------
// STATUS HANDLING (FINAL FIX)
// -----------------------------
let displayStatus = "";
const status = fx.fixture.status;

// Live elapsed from live scores
const liveElapsed = fixtureDoc.livescore?.status?.elapsed;

// 1️⃣ LIVE (highest priority)
if (liveElapsed != null && liveElapsed >= 0) {
  displayStatus = `${liveElapsed}'`;
}

// 2️⃣ FINISHED
else if (status.short === "FT") {
  displayStatus = "FT";
}

// 3️⃣ NOT STARTED → show time
else if (status.short === "NS") {
  const dateObj = new Date(fx.fixture.date);
  displayStatus = dateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Nairobi", // ← important
  });
}


// 4️⃣ FALLBACK (use fixture status.elapsed if exists)
else if (status.elapsed) {
  displayStatus = `${status.elapsed}'`;
}

// 5️⃣ UNKNOWN
else {
  displayStatus = "—";
}


  // -----------------------------
  // SCORE HANDLING (LIVE OR FT)
  // -----------------------------
  let scoreDisplay = null;
  if (status.short === "FT") {
    scoreDisplay = `${fx.goals.home} - ${fx.goals.away}`;
  } else if (fixtureDoc.livescore?.goals) {
    scoreDisplay = `${fixtureDoc.livescore.goals.home} - ${fixtureDoc.livescore.goals.away}`;
  }

  // -----------------------------
  // ODDS HANDLING (MARKET = 1️⃣ Match Winner)
  // -----------------------------
  let odds = { home: null, draw: null, away: null };

  if (fixtureDoc.odds && fixtureDoc.odds.length > 0) {
    for (const bookmaker of fixtureDoc.odds) {
      const matchWinnerMarket = bookmaker.markets.find(
        (market) => market.name?.toLowerCase() === "match winner"
      );

      if (matchWinnerMarket?.values) {
        odds.home = matchWinnerMarket.values.find(v => v.value === "Home")?.odd || null;
        odds.draw = matchWinnerMarket.values.find(v => v.value === "Draw")?.odd || null;
        odds.away = matchWinnerMarket.values.find(v => v.value === "Away")?.odd || null;
        break; // stop after first bookmaker that has match winner
      }
    }
  }

  return {
    fixtureId: fixtureDoc.fixtureId,
    status: displayStatus,
    score: scoreDisplay,
    league: {
      id: fx.league.id,
      name: fx.league.name,
      logo: fx.league.logo,
      country: fx.league.country
    },
    homeTeam: {
      id: fx.teams.home.id,
      name: fx.teams.home.name,
      logo: fx.teams.home.logo
    },
    awayTeam: {
      id: fx.teams.away.id,
      name: fx.teams.away.name,
      logo: fx.teams.away.logo
    },
    odds
  };
}
