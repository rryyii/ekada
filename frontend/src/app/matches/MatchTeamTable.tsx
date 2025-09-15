import { SummonerImage, ItemImage, championList } from "../util/champion-images";
import { MatchData } from "../util/match-series";

/**
 * Returns a component including a table for the team's match data.
 * @param selectedMatch Match data for the selected match.
 * @param team Name of the team.
 * @param teams Array of the team, its players, and relevant data.
 */
function MatchTeamTable({selectedMatch, team, teams} : {selectedMatch : MatchData, team : string, teams : Array<any>}) {
    if (selectedMatch == null || team == null || teams == null) {
        console.error("Null value was passed to state.")
        return;
    }

    return (
        <table className="match-table">
            <thead>
                <tr>
                    <th>
                        {team} 
                        {selectedMatch?.WinTeam == team ?
                            <h1 className="winner-team">Won</h1>
                            : <h1 className="loser-team">Lost</h1>
                        }
                        <div>
                            {teams[0].title.Side == "1" ? "Blue" : "Red"}
                        </div>
                    </th>
                </tr>
                <tr className="match-table-header">
                    <th>Spells</th>
                    <th>Items</th>
                    <th>KDA</th>
                    <th>CS</th>
                    <th>Gold</th>
                    <th>Damage</th>
                    <th>Champion</th>
                </tr>
            </thead>
            <tbody>
                {teams ? teams.map((item: any) => (
                    <tr key={`team-details-${item.title.Name}`}>
                        <td>
                            <ItemImage item={item.title.Trinket} patch={selectedMatch?.Patch ?? ""} />
                            {item.title.SummonerSpells.split(",").map((val: string, idx: number) => (
                                <SummonerImage key={idx} spell={val} />
                            ))}
                        </td>
                        <td className="d-flex">
                            {item.title.Items.split(";").map((val: string, idx: number) => (
                                <ItemImage key={idx} item={val} patch={selectedMatch?.Patch ?? ""} />
                            ))}
                        </td>
                        <td>
                            <span>{item.title.Kills}</span>
                            <span> / </span>
                            <span>{item.title.Deaths}</span>
                            <span> / </span>
                            <span>{item.title.Assists}</span>
                        </td>
                        <td>
                            <span>{item.title.CS}</span>
                        </td>
                        <td>
                            <span>{parseInt(item.title.Gold).toLocaleString("en-US")} </span>
                        </td>
                        <td>
                            <span>{parseInt(item.title.DamageToChampions).toLocaleString("en-US")} </span>
                        </td>
                        <td className="d-flex flex-row align-items-start">
                            <span>{championList(item.title.Champion)}</span>
                            <span> {item.title.Name}</span>
                        </td>
                    </tr>
                ))
                    : <tr></tr>}
            </tbody>
        </table>
    );
}

export default MatchTeamTable;