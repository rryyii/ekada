/**
 * A helper function that groups fetched series into two maps for both future and current matches.
 * 
 * @param rawMatches Data involving the current selected series to group.
 * @returns An array of past series, future series, tournament name, and international series.
 * @category Util
 */
export function groupMatchesIntoSeries(rawMatches: any) {
    const currentMap = new Map();
    const futureMap = new Map();
    const today = new Date();
    const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    let international = false;
    for (const match of rawMatches) {
        const raw = match.DateTime_UTC ?? match["DateTime UTC"] ?? match["DateTime-UTC"] ?? match["DateTime UTC"];
        if (!raw) continue;
        const date = new Date(raw);
        if (isNaN(date.getTime())) continue;
        const dateLocal = new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const tournamentName = match.Name;

        const isFuture = dateLocal > todayLocal;

        if (match.Split != null) {
            const targetMap = isFuture ? futureMap : currentMap;

            if (!targetMap.has(tournamentName)) {
                targetMap.set(tournamentName, new Map());
            }

            const dateMap = targetMap.get(tournamentName);

            if (!dateMap.has(formattedDate)) {
                dateMap.set(formattedDate, []);
            }

            dateMap.get(formattedDate).push(match);
            international = false;  
        } else if (match.Name && (match.Name.includes("First Stand") || match.Name.includes("MSI") || match.Name.includes("Worlds"))) {
            const target = isFuture ? futureMap : currentMap;
            if (target.has(formattedDate)) {
                target.get(formattedDate).push(match);
            } else {
                target.set(formattedDate, [match]);
            }
            international = true;
        }
    }
    const tName = rawMatches[0]?.Name;
    console.log(currentMap)
    return [currentMap, futureMap, tName, international];
}


/**
 * A helper function that groups a list of players into a map with their relevant team.
 * 
 * @param rawPlayers Data involving a raw list of players to group.
 * @returns A map including the players categorized into their teams.
 * @category Util
 */
export function groupPlayersIntoTeams(rawPlayers: any) {
    const cargo = rawPlayers;
    const map = new Map();
    for (const player of cargo) {
        const team = player.Team;
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

export function parseChampionBans(bans : string) {
    console.log(bans);
    const map = new Map();
    const banList = bans.split(",");
    for (const ban in banList) {
        if (map.has(ban)) {
            map.set(ban, map.get(ban) + 1);
        } else {
            map.set(ban, 1);
        }
    }
    return map;
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
