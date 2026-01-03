/**
 * Calculates statistical comparison between two teams based on their last 5 matches.
 * 
 * @param {Array} homeLast5 - Last 5 matches for home team
 * @param {Array} awayLast5 - Last 5 matches for away team
 * @returns {Object} Comparison object { home: Stats, away: Stats }
 */
export function calculateComparison(homeLast5, awayLast5) {
    if (!homeLast5 || !awayLast5) return null;

    // Helper: Normalize match object (handles both raw API and flattened structures)
    const normalize = (m) => {
        if (m.teams && m.goals) return m;
        if (m.homeTeam && m.score) {
            return {
                teams: { home: m.homeTeam, away: m.awayTeam },
                goals: { home: m.score.home, away: m.score.away }
            };
        }
        return null;
    };

    const calculateStats = (matches, teamId) => {
        const valid = matches.map(normalize).filter(Boolean);
        const total = valid.length;
        if (total === 0) return null;

        let wins = 0;
        let draws = 0;
        let losses = 0;
        let goalsScored = 0;
        let goalsConceded = 0;
        let btts = 0;
        let over25 = 0;
        let cleanSheets = 0;

        valid.forEach(m => {
            // Determine side based on ID if available, or name (logic depends on context)
            // Note: formCalculator usually provides 'homeTeam' in flattened structure for the team in question
            // But here we rely on the context passed.
            // Wait, calculateTeamForm returns last 5 matches of THE TEAM.
            // So we need to know if the team played Home or Away in that specific match to count goals correctly.

            // In the 'flattened' structure (from formCalculator/backend store), usually:
            // if we used calculateTeamForm, the matches are from that team's perspective? 
            // Actually calculateTeamForm returns the raw array or flattened array.

            // Let's assume the teamId matches m.teams.home.id or m.teams.away.id
            const isHome = m.teams.home.id === teamId;
            // Fallback for name based check if IDs are missing (less reliable)

            const myGoals = isHome ? m.goals.home : m.goals.away;
            const oppGoals = isHome ? m.goals.away : m.goals.home;

            if (myGoals > oppGoals) wins++;
            else if (myGoals < oppGoals) losses++;
            else draws++;

            goalsScored += myGoals;
            goalsConceded += oppGoals;

            if (myGoals > 0 && oppGoals > 0) btts++;
            if ((myGoals + oppGoals) > 2.5) over25++;
            if (oppGoals === 0) cleanSheets++;
        });

        return {
            played: total,
            wins,
            draws,
            losses,
            goalsScored, // Total
            goalsConceded, // Total
            avgGoalsScored: parseFloat((goalsScored / total).toFixed(1)),
            avgGoalsConceded: parseFloat((goalsConceded / total).toFixed(1)),
            bttsPercentage: Math.round((btts / total) * 100),
            over25Percentage: Math.round((over25 / total) * 100),
            cleanSheetPercentage: Math.round((cleanSheets / total) * 100),
        };
    };

    // We need Team IDs to correctly identify 'Home/Away' in history 
    // BUT calculateComparison arguments in previous file didn't pass IDs.
    // Let's update arguments to accept IDs or names, or just assume the 'homeLast5' 
    // contains matches where we can deduce the team.
    // Actually, 'calculateTeamForm' in fixtureService fetches matches for a specific team ID.
    // We should pass the Team IDs to this function to be safe.

    // However, to keep signature similar or easy refactor, let's look at fixtureService.js call site.
    // It passes (homeData.last5Matches, awayData.last5Matches, h2h, homeName, awayName).
    // We should verify if existing code passes IDs. It does not.
    // I will update this function to accept IDs instead of Names for better precision, 
    // or use Names if IDs not available.

    return {
        home: null, // Placeholder, see logic update below
        away: null
    };
}

/**
 * REVISED EXPORT
 * @param {Array} homeLast5 
 * @param {Number} homeId 
 * @param {Array} awayLast5 
 * @param {Number} awayId 
 */
export function calculateComparisonStats(homeLast5, homeId, awayLast5, awayId) {
    // Re-using the logic above

    // Helper: Normalize match object
    const normalize = (m) => {
        if (m.teams && m.goals) return m;
        if (m.homeTeam && m.score) {
            return {
                teams: { home: m.homeTeam, away: m.awayTeam },
                goals: { home: m.score.home, away: m.score.away }
            };
        }
        return null;
    };

    const calculate = (matches, tid) => {
        if (!matches) return null;
        const valid = matches.map(normalize).filter(Boolean);
        if (valid.length === 0) return null;

        let wins = 0, draws = 0, losses = 0;
        let gf = 0, ga = 0; // goals for, goals against
        let btts = 0, over25 = 0, cs = 0;

        valid.forEach(m => {
            const isHome = m.teams.home.id === tid;
            const myGoals = isHome ? m.goals.home : m.goals.away;
            const oppGoals = isHome ? m.goals.away : m.goals.home;

            if (myGoals > oppGoals) wins++;
            else if (myGoals < oppGoals) losses++;
            else draws++;

            gf += myGoals;
            ga += oppGoals;

            if (myGoals > 0 && oppGoals > 0) btts++;
            if ((myGoals + oppGoals) > 2.5) over25++;
            if (oppGoals === 0) cs++;
        });

        const total = valid.length;
        return {
            played: total,
            wins, draws, losses,
            avgGoalsFor: (gf / total).toFixed(1),
            avgGoalsAgainst: (ga / total).toFixed(1),
            bttsPct: Math.round((btts / total) * 100),
            over25Pct: Math.round((over25 / total) * 100),
            cleanSheetPct: Math.round((cs / total) * 100),
        };
    };

    return {
        home: calculate(homeLast5, homeId),
        away: calculate(awayLast5, awayId)
    };
}
