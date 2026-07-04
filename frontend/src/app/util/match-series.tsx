/**
 * A helper function that groups fetched series into two maps for both future and current matches.
 * 
 * @param rawMatches Data involving the current selected series to group.
 * @returns An array of past series, future series, tournament name, and international series.
 * @category Util
 */
export function groupMatches(matches: any) {
    const map = new Map();
    for (const game of matches) {
        const gameId = game.GameId;
        if (map.has(gameId)) {
            const current = map.get(gameId);
            current.push(game);
        } else {
            map.set(gameId, [game])
        }
    }
    return map;
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
        const gameId = player.GameId;

        if (!map.has(team)) {
            map.set(team, new Map());
        }
        const teamMap = map.get(team)!;

        if (teamMap.has(gameId)) {
            teamMap.get(gameId)!.push(player);
        } else {
            teamMap.set(gameId, [player]);
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

export function parseChampionBans(bans: string) {
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
