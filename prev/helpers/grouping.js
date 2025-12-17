// helpers/groupByLeague.js

/**
 * Groups merged fixture-prediction data by league and country.
 * 
 * Input: [
 *   { league: "Premier League", country: "England", fixtureId: 1, ... },
 *   { league: "Premier League", country: "England", fixtureId: 2, ... },
 *   { league: "Premier League", country: "Kenya", fixtureId: 3, ... },
 *   { league: "La Liga", country: "Spain", fixtureId: 4, ... }
 * ]
 *
 * Output: [
 *   { league: "Premier League", country: "England", fixtures: [ {...}, {...} ] },
 *   { league: "Premier League", country: "Kenya", fixtures: [ {...} ] },
 *   { league: "La Liga", country: "Spain", fixtures: [ {...} ] }
 * ]
 */

export const groupByLeague = (mergedData) => {
  const grouped = {};

  mergedData.forEach((item) => {
    const key = `${item.league} - ${item.country}`; // ✅ unique per league & country

    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(item);
  });

  // Convert object to array for easier rendering
  return Object.keys(grouped).map((key) => {
    const [leagueName, countryName] = key.split(" - ");

    return {
      league: leagueName,
      country: countryName,
      leagueLogo: grouped[key][0]?.leagueLogo || "",
      countryLogo: grouped[key][0]?.countryLogo || "",
      fixtures: grouped[key],
    };
  });
};
