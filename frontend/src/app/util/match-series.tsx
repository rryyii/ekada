/**
 * A helper function that groups fetched series into two maps for both future and current matches.
 * 
 * @param rawMatches Data involving the current selected series to group.
 * @returns An array of past series, future series, tournament name, and international series.
 * @category Util
 */
export function groupMatchesIntoSeries(rawMatches: { cargoquery: any }) {
    const currentMap = new Map();
    const futureMap = new Map();
    const today = new Date();
    let international = false;
    let cargo = rawMatches.cargoquery;
    for (const match of cargo) {
        const date = new Date(match.title["DateTime UTC"]);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const tournamentName = match.title.Name;
        if (match.title.Split != null) {
            const targetMap = date >= today ? futureMap : currentMap;

            if (!targetMap.has(tournamentName)) {
                targetMap.set(tournamentName, new Map());
            }

            const dateMap = targetMap.get(tournamentName);

            if (!dateMap.has(formattedDate)) {
                dateMap.set(formattedDate, []);
            }

            dateMap.get(formattedDate).push(match);
            international = false;
        } else if (match.title.Name.includes("First Stand") || match.title.Name.includes("MSI")|| match.title.Name.includes("Worlds") ) {
            if (date >= today) {
                if (futureMap.has(formattedDate)) {
                    const current = futureMap.get(formattedDate);
                    current.push(match);
                } else {
                    futureMap.set(formattedDate, [match]);
                }
            } else {
                if (currentMap.has(formattedDate)) {
                    const current = currentMap.get(formattedDate);
                    current.push(match)
                } else {
                    currentMap.set(formattedDate, [match]);
                }
            }
            international = true;
        }
    }
    const tName = cargo[0]?.title.Name;
    return [currentMap, futureMap, tName, international];
}


/**
 * A helper function that groups a list of players into a map with their relevant team.
 * 
 * @param rawPlayers Data involving a raw list of players to group.
 * @returns A map including the players categorized into their teams.
 * @category Util
 */
export function groupPlayersIntoTeams(rawPlayers: { cargoquery: any }) {
    const cargo = rawPlayers.cargoquery;
    const map = new Map();
    for (const player of cargo) {
        const team = player.title.Team;
        if (map.has(team)) {
            const current = map.get(team);
            current.push(player);
        } else {
            map.set(team, [player]);
        }
    }
    return map;
}

/**
 * A helper function that groups players to their relevant role into a map.
 * 
 * @param players Data including the team's players
 * @param roles Data including the team's roles
 * @returns An array including both coach and player maps.
 * @category Util
 */
export function parsePlayersIntoRoles(players: string, roles: string) {
    const playersList = players.split(";;");
    const rolesList = roles.split(";;");
    const playerMap = new Map();
    const coachMap = new Map();
    for (let i = 0; i < playersList.length; i++) {
        if (rolesList[i] == "Coach") {
            coachMap.set(playersList[i], rolesList[i]);
        } else {
            playerMap.set(playersList[i], rolesList[i]);
        }
    }
    return [playerMap, coachMap];
}

export type MatchData = {
    MatchId: number,
    Team1: string,
    Team2: string,
    VOD: string,
    Team1Bans: string,
    Team2Bans: string,
    Patch: string,
    Gamelength: string,
    WinTeam: string,
    Team1Barons: number,
    Team2Barons: number,
    Team1Dragons: number,
    Team2Dragons: number,
    Team1Atakhans: number,
    Team2Atakhans: number,
    Team1RiftHeralds: number,
    Team2RiftHeralds: number,
    Team1Towers: number,
    Team2Towers: number,
    Team1VoidGrubs: number,
    Team2VoidGrubs: number,
}

export type StandingsData = {
    Place: string,
    Team: string,
    WinSeries: string,
    LossSeries: string, 
    Points: number,
    Streak: number,
    StreakDirection: string,
}
