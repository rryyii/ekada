/**
 * A helper function that groups fetched series into two maps for both future and current matches.
 * 
 * @param rawMatches Data involving the current selected series to group.
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
 * @category Util
 */
export function parsePlayersIntoRoles(players: string, roles: string) {
    const playersList = players.split(";;");
    const rolesList = roles.split(";;");
    const map = new Map();
    for (let i = 0; i < playersList.length; i++) {
        map.set(playersList[i], rolesList[i]);
    }
    return map;
}

export interface MatchData {
    title: any,
}
