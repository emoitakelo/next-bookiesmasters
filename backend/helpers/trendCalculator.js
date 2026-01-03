/**
 * Analyzes match history to generate "stories" or trends.
 * 
 * @param {Array} homeLast5 - Array of last 5 matches for home team
 * @param {Array} awayLast5 - Array of last 5 matches for away team
 * @param {Array} h2h - Array of head-to-head matches
 * @param {String} homeName - Name of home team
 * @param {String} awayName - Name of away team
 * @returns {Array} Array of trend objects { text, type: 'positive'|'negative'|'neutral', icon }
 */
export function calculateTrends(homeLast5, awayLast5, h2h, homeName, awayName) {
    const trends = [];
    if (!homeLast5 || !awayLast5) return trends;

    // Helper: Count wins/goals
    const analyzeForm = (matches, teamName, isHomeTeamOfFixture) => {
        if (!matches || matches.length === 0) return {};

        // Filter valid matches (sometimes API returns nulls)
        const valid = matches.filter(m => m.teams && m.goals);
        if (valid.length < 3) return {};

        let wins = 0;
        let losses = 0;
        let draws = 0;
        let over25 = 0;
        let btts = 0; // Both Teams To Score
        let cleanSheets = 0;

        valid.forEach(m => {
            // Determine result relative to THIS team
            // Note: In last5 array, "home" might be away in that specific past match
            const isHome = m.teams.home.name === teamName;
            const myGoals = isHome ? m.goals.home : m.goals.away;
            const oppGoals = isHome ? m.goals.away : m.goals.home;

            if (myGoals > oppGoals) wins++;
            else if (myGoals < oppGoals) losses++;
            else draws++;

            if ((m.goals.home + m.goals.away) > 2.5) over25++;
            if (m.goals.home > 0 && m.goals.away > 0) btts++;
            if (oppGoals === 0) cleanSheets++;
        });

        return { wins, losses, draws, over25, btts, cleanSheets, total: valid.length };
    };

    // --- 1. FORM ANALYSIS ---
    const hForm = analyzeForm(homeLast5, homeName, true);
    const aForm = analyzeForm(awayLast5, awayName, false);

    // Winning Streaks (recent 3+)
    // Note: This simple count just checks total in last 5, not consecutive order for simplicity, 
    // but usually last5 is sorted. Let's assume strict streak requires sorting check, 
    // but for "X of last Y" phrasing, simple count is safer.

    if (hForm.wins >= 4) {
        trends.push({ text: `${homeName} have won ${hForm.wins} of their last ${hForm.total} matches`, type: 'positive', icon: '🔥' });
    }
    if (aForm.wins >= 4) {
        trends.push({ text: `${awayName} have won ${aForm.wins} of their last ${aForm.total} matches`, type: 'positive', icon: '🔥' });
    }

    // Losing Streaks
    if (hForm.losses >= 4) {
        trends.push({ text: `${homeName} have lost ${hForm.losses} of their last ${hForm.total} matches`, type: 'negative', icon: '📉' });
    }

    // --- 2. GOALS TRENDS ---
    // High Scoring
    if (hForm.over25 >= 4) {
        trends.push({ text: `Over 2.5 goals in ${hForm.over25} of ${homeName}'s last ${hForm.total} matches`, type: 'neutral', icon: '⚽' });
    }
    if (aForm.over25 >= 4) {
        trends.push({ text: `Over 2.5 goals in ${aForm.over25} of ${awayName}'s last ${aForm.total} matches`, type: 'neutral', icon: '⚽' });
    }

    // BTTS
    if (hForm.btts >= 4) {
        trends.push({ text: `Both teams scored in ${hForm.btts} of ${homeName}'s last ${hForm.total} matches`, type: 'neutral', icon: '🥅' });
    }

    // Clean Sheets (Defense)
    if (hForm.cleanSheets >= 3) {
        trends.push({ text: `${homeName} kept a clean sheet in ${hForm.cleanSheets} of last ${hForm.total} matches`, type: 'positive', icon: '🛡️' });
    }

    // --- 3. HEAD TO HEAD ---
    if (h2h && h2h.length >= 3) {
        const h2hValid = h2h.filter(m => m.teams && m.goals);
        let hWins = 0;
        let aWins = 0;

        h2hValid.forEach(m => {
            const hGoals = m.teams.home.name === homeName ? m.goals.home : m.goals.away;
            const aGoals = m.teams.away.name === awayName ? m.goals.away : m.goals.home; // Logic check: home vs away names usually map fixed in H2H list

            // Simpler: Just check score based on the fixture object provided in H2H
            // API-Football H2H returns a list of fixtures.
            // We need to match names carefully.

            // Let's assume m.teams.home.name is valid.
            const isHomeWinner = (m.goals.home > m.goals.away) && (m.teams.home.name === homeName || m.teams.away.name === awayName);
            // This H2H logic can be tricky if teams swap home/away.

            // Easier H2H logic: Counts
            if (m.teams.home.name === homeName && m.goals.home > m.goals.away) hWins++;
            else if (m.teams.away.name === homeName && m.goals.away > m.goals.home) hWins++;

            if (m.teams.home.name === awayName && m.goals.home > m.goals.away) aWins++;
            else if (m.teams.away.name === awayName && m.goals.away > m.goals.home) aWins++;
        });

        if (hWins >= 3) {
            trends.push({ text: `${homeName} have won ${hWins} of the last ${h2hValid.length} meetings against ${awayName}`, type: 'positive', icon: '⚔️' });
        } else if (aWins >= 3) {
            trends.push({ text: `${awayName} have won ${aWins} of the last ${h2hValid.length} meetings against ${homeName}`, type: 'positive', icon: '⚔️' });
        }
    }

    return trends.slice(0, 4); // Limit to top 4 trends
}
