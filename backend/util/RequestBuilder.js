/**
 * Builder class to help with creating long GET requests to Leaguepedia.
 */
export class RequestBuilder {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async fetchStandings(leagueName) {
        const params = new URLSearchParams({
            tables: "Standings",
            fields: "Standings.Team,Standings.Place,Standings.WinSeries,Standings.LossSeries,Standings.Streak,Standings.StreakDirection,Standings.Points",
            where: `Standings.OverviewPage="${leagueName}"`,
            order_by: "Standings.Place",
        });
        return `${this.baseUrl}&${params.toString()}`;
    }

    async fetchInternationalMatchSchedule(internationalName) {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().slice(0, 10);
        const params = new URLSearchParams({
            tables: "MatchSchedule=MS,Tournaments=TS,ScoreboardGames=SG",
            fields: "SG.WinTeam,MS.Winner,TS.Name,MS.Team1,SG.Team1Bans,SG.Team1Picks,MS.Team1Score,SG.Team1Dragons,SG.Team2Dragons,SG.Team1Barons,SG.Team2Barons,SG.Team1VoidGrubs,SG.Team2VoidGrubs,SG.Team1Towers,SG.Team2Towers,SG.Team1RiftHeralds,SG.Team2RiftHeralds,TS.OverviewPage,SG.Team1Atakhans,SG.Team2Atakhans,SG.Team1Gold,SG.Team2Gold,MS.Team2,SG.Team2Bans,SG.Team2Picks,MS.Team2Score,SG.Team2Dragons,TS.Split,MS.DateTime_UTC,SG.Gamelength,SG.Patch,SG.VOD,MS.MatchId",
            where: `TS.Name LIKE "${internationalName[0]}%" AND MS.DateTime_UTC BETWEEN '${currentDate.getFullYear() - 1}-01-01' AND '${dateString}'`,
            join_on: "MS.OverviewPage=TS.OverviewPage,MS.MatchId=SG.MatchId",
            order_by: 'MS.DateTime_UTC DESC',
            limit: '500',
        });
        return `${this.baseUrl}&${params.toString()}`;
    }

    async fetchMatchSchedule(leagueName) {
        const currentDate = new Date();
        const dateString = currentDate.toISOString().slice(0, 10);
        const params = new URLSearchParams({
            tables: "MatchSchedule=MS,Tournaments=TS,ScoreboardGames=SG",
            fields: "SG.WinTeam,MS.Winner,TS.Name,MS.Team1,SG.Team1Bans,SG.Team1Picks,MS.Team1Score,SG.Team1Dragons,SG.Team2Dragons,SG.Team1Barons,SG.Team2Barons,SG.Team1VoidGrubs,SG.Team2VoidGrubs,SG.Team1Towers,SG.Team2Towers,SG.Team1RiftHeralds,SG.Team2RiftHeralds,TS.OverviewPage,SG.Team1Atakhans,SG.Team2Atakhans,SG.Team1Gold,SG.Team2Gold,MS.Team2,SG.Team2Bans,SG.Team2Picks,MS.Team2Score,SG.Team2Dragons,TS.Split,MS.DateTime_UTC,SG.Gamelength,SG.Patch,SG.VOD,MS.MatchId",
            where: `TS.Name LIKE "${leagueName}%" AND MS.DateTime_UTC BETWEEN '${dateString.slice(0, 4)}-01-01' AND '${dateString}'`,
            join_on: "MS.OverviewPage=TS.OverviewPage,MS.MatchId=SG.MatchId",
            order_by: 'MS.DateTime_UTC DESC',
            limit: '500',
        });
        return `${this.baseUrl}&${params.toString()}`;
    }

    async fetchMatchData(matchId, gameId) {
        const params = new URLSearchParams({
            tables: "ScoreboardPlayers=SP",
            fields: "SP.DamageToChampions,SP.Side,SP.PlayerWin,SP.MatchId,SP.Team,SP.Name,SP.Role,SP.Items,SP.Trinket,SP.CS,SP.Runes,SP.Kills,SP.Deaths,SP.Assists,SP.Gold,SP.VisionScore,SP.Champion,SP.SummonerSpells",
            where: `SP.MatchId="${matchId}" AND SP.GameId="${matchId}_${gameId}"`,
        });
        return `${this.baseUrl}&${params.toString()}`;
    }

    async fetchTeamData(teamName, tournamentName) {
        const params = new URLSearchParams({
            tables: "TournamentRosters=TR",
            fields: "TR.Team,TR.RosterLinks,TR.Roles,TR.Region",
            where: `TR.Tournament="${tournamentName}" AND TR.Team="${teamName}"`,
        });
        return `${this.baseUrl}&${params.toString()}`;
    }

    async fetchTeamInfo(teamName, tournamentName) {
        const params = new URLSearchParams({
            tables: "TournamentRosters=TR",
            fields: "TR.Team,TR.RosterLinks",
            where: `TR.Team="${teamName}" AND TR.Tournament="${tournamentName}"`,
        });
        return `${this.baseUrl}&${params.toString()}`;
    }
}