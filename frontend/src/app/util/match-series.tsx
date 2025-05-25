export function groupMatchesIntoSeries(rawMatches: { cargoquery: any }) {
    const currentMap = new Map();
    const futureMap = new Map();
    const today = new Date();
    let cargo = rawMatches.cargoquery;
    const op = cargo[0].title.OverviewPage;

    for (const match of cargo) {
        const date = new Date(match.title["DateTime UTC"]);
        const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-US', options);
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
    }
    return [currentMap, futureMap, op];
}

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

export interface MatchData {
    title: any,
}