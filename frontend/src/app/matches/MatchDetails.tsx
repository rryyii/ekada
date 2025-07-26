import { useLocation, Link } from "react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { championList, ItemImage, SummonerImage } from "../util/champion-images";
import { groupPlayersIntoTeams, MatchData } from "../util/match-series";

/**
 * Returns a component that displays necessary details for a selected match.
 * 
 * @category Match
 */
function MatchDetails() {
    const location = useLocation();
    const { value, tournamentName } = location.state;
    const [selectedMatch, setSelectedMatch] = useState<MatchData>();
    const [teams, setTeams] = useState<any>();
    const [queryKey, setQueryKey] = useState(0);

    const { data } = useQuery({
        queryKey: [`matchData-${selectedMatch?.MatchId}`, selectedMatch?.MatchId, queryKey],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/match/${encodeURIComponent(selectedMatch?.MatchId ?? "")}/${queryKey}`)
            .then((res) => res.json()),
        enabled: !!selectedMatch && !!queryKey,
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    useEffect(() => {
        if (data) {
            setTeams(groupPlayersIntoTeams(data));
        }
        if (value && queryKey == 0) {
            setSelectedMatch(value[0].title);
            setQueryKey(1);
        }
    }, [data])

    return (
        <div className="d-flex flex-column">
            <div id="match-details" className="d-flex flex-col justify-content-evenly">
                <div id="match-content">
                    <div className="match-btns">
                        {value.map((item: any, index: number) => (
                            <button key={index} className="btn btn-light match-btn" onClick={() => { setSelectedMatch(item.title); setQueryKey(index + 1); }}>{index + 1}</button>
                        ))}
                        <a className="btn btn-light" target="_blank" href={selectedMatch ? selectedMatch.VOD : "Loading"}>
                            VOD
                        </a>
                    </div>
                    <div className="d-flex flex-col justify-content-around">
                        <div className="match-team1 d-flex">
                            <Link to={`/team/${selectedMatch?.Team1}/${tournamentName}`}>
                                <h1>{selectedMatch ? selectedMatch.Team1 : "No Team 1 Found"}</h1>
                            </Link>
                        </div>
                        <div className="match-team2">
                            <Link to={`/team/${selectedMatch?.Team2}/${tournamentName}`}>
                                <h1>{selectedMatch ? selectedMatch.Team2 : "No Team 2 Found"}</h1>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <div id="match-bans" className="d-flex flex-row justify-content-around">
                            {selectedMatch ? championList(selectedMatch.Team1Bans) : "Fetching Team 1 Bans"}
                            {selectedMatch ? championList(selectedMatch.Team2Bans) : "Fetching Team 2 Bans"}
                        </div>
                        {selectedMatch ? <Objectives selectedMatch={selectedMatch} /> : "Failed to display objectives"}
                    </div>
                    <div className="d-flex p-5 flex-col gap-3 match-container flex-wrap">
                        <table className="match-table">
                            <thead>
                                <tr>
                                    <th>
                                        {selectedMatch?.Team1} {selectedMatch?.WinTeam == selectedMatch?.Team1 ?
                                            <h1 className="winner-team">Won</h1>
                                            : <h1 className="loser-team">Lost</h1>
                                        }
                                        <div>
                                            {teams?.get(selectedMatch?.Team1)[0].title.Side == "1" ? "Blue" : "Red"}
                                        </div>
                                    </th>
                                    <th>
                                        <p>Patch {selectedMatch ? selectedMatch.Patch : "Loading"}</p>
                                    </th>
                                    <th>
                                        <p>{selectedMatch ? selectedMatch.Gamelength : "Loading"}</p>
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
                                {teams ? teams.get(selectedMatch?.Team1).map((item: any) => (
                                    <tr key={`team-details-${item.title.Name}`}>
                                        <td>
                                            <ItemImage item={item.title.Trinket} patch={selectedMatch?.Patch ?? ""} />
                                            {item.title.SummonerSpells.split(",").map((val: string, idx: number) => (
                                                <SummonerImage key={idx} spell={val} />
                                            ))}
                                        </td>
                                        <td className="d-flex flex-wrap player-items">
                                            {item.title.Items.split(";").map((val: string, idx: number) => (
                                                <ItemImage key={idx} item={val} patch={selectedMatch?.Patch ?? ""} />
                                            ))}
                                        </td>
                                        <td>
                                            <span>{item.title.Kills}</span>
                                            <span>/</span>
                                            <span>{item.title.Deaths}</span>
                                            <span>/</span>
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
                                        <td className="d-flex flex-row align-items-end">
                                            <span>{championList(item.title.Champion)}</span>
                                            <span> {item.title.Name}</span>
                                        </td>
                                    </tr>
                                ))
                                    : <tr></tr>}
                            </tbody>
                        </table>
                        <hr></hr>
                        <table className="match-table">
                            <thead>
                                <tr>
                                    <th>
                                        {selectedMatch?.Team2} {selectedMatch?.WinTeam == selectedMatch?.Team2 ?
                                            <h1 className="winner-team">Won</h1>
                                            : <h1 className="loser-team">Lost</h1>
                                        }
                                        <div>
                                            {teams?.get(selectedMatch?.Team2)[0].title.Side == "1" ? "Blue" : "Red"}
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
                                {teams ? teams.get(selectedMatch?.Team2).map((item: any) => (
                                    <tr key={`team-details-${item.title.Name}`}>
                                        <td>
                                            <ItemImage item={item.title.Trinket} patch={selectedMatch?.Patch ?? ""} />
                                            {item.title.SummonerSpells.split(",").map((val: string, idx: number) => (
                                                <SummonerImage key={idx} spell={val} />
                                            ))}
                                        </td>
                                        <td className="d-flex flex-wrap player-items">
                                            {item.title.Items.split(";").map((val: string, idx: number) => (
                                                <ItemImage key={idx} item={val} patch={selectedMatch?.Patch ?? ""} />
                                            ))}
                                        </td>
                                        <td>
                                            <span>{item.title.Kills}</span>
                                            <span>/</span>
                                            <span>{item.title.Deaths}</span>
                                            <span>/</span>
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
                                        <td className="d-flex flex-row align-items-end">
                                            <span>{championList(item.title.Champion)}</span>
                                            <span> {item.title.Name}</span>
                                        </td>
                                    </tr>
                                ))
                                    : <tr></tr>}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

/**
 * Returns a component including relevant elements for a matches objective data, including icons and their corresponding numbers
 *
 * @param selectedMatch Relevant match data for the selected match.
 * @category Match
 */
function Objectives({ selectedMatch }: { selectedMatch: MatchData }) {
    return (
        <div>
        
        </div>
    );
}

export default MatchDetails;

