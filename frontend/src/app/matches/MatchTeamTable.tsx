import { championList } from "../util/champion-images";
/**
 * Returns a component including a table for the team's match data.
 * @param selectedMatch Match data for the selected match.
 * @param team Name of the team.
 * @param teams Array of the team, its players, and relevant data.
 */
function MatchTeamTable({ selectedMatch, team, teams }: { selectedMatch: any, team: any, teams: any }) {
    if (selectedMatch == null || team == null || teams == null) {
        console.error("Null value was passed to state.")
        return;
    }
    return (
        <table className="match-table match-container">
            <thead>
                <tr>
                    <th className={"d-flex justify-content-between"}>
                        <div>
                            {team}
                            {selectedMatch[0].WinTeam == team ?
                                <h1 className="winner-team">Won</h1>
                                : <h1 className="loser-team">Lost</h1>
                            }
                        </div>
                        <div>
                            {teams[0].Side == "1" ? "Blue" : "Red"}
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
                    <tr key={`team-details-${item.Name}`}>
                        <td>
                            {/* <ItemImage item={item.Trinket} />
                            {item.SummonerSpells.split(",").map((val: string, idx: number) => (
                                <SummonerImage key={idx} spell={val} />
                            ))} */}
                        </td>
                        <td className="d-flex">
                            {/* {item.Items.split(";").map((val: string, idx: number) => (
                                <ItemImage key={idx} item={val} />
                            ))} */}
                        </td>
                        <td>
                            <span>{item.Kills}</span>
                            <span> / </span>
                            <span>{item.Deaths}</span>
                            <span> / </span>
                            <span>{item.Assists}</span>
                        </td>
                        <td>
                            <span>{item.CS}</span>
                        </td>
                        <td>
                            <span>{parseInt(item.Gold).toLocaleString("en-US")} </span>
                        </td>
                        <td>
                            <span>{parseInt(item.DamageToChampions).toLocaleString("en-US")} </span>
                        </td>
                        <td className="d-flex flex-row gap-2 align-items-center">
                            <span>{championList(item.Champion)}</span>
                            <span> {item.Name}</span>
                        </td>
                    </tr>
                ))
                    : <tr></tr>}
            </tbody>
        </table>
    );
}

export default MatchTeamTable;