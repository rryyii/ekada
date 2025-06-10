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
        queryKey: [`matchData-${selectedMatch?.title.MatchId}`, selectedMatch?.title.MatchId, queryKey],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/match/${encodeURIComponent(selectedMatch?.title.MatchId)}/${queryKey}`).then((res) => res.json()),
        enabled: !!selectedMatch && !!queryKey,
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    useEffect(() => {
        if (data) {
            setTeams(groupPlayersIntoTeams(data));
        }
        if (value && queryKey == 0) {
            setSelectedMatch(value[0]);
            setQueryKey(1);
        }

    }, [data])
    console.log(data);
    return (
        <div className="d-flex">
            <div className="match-btns">
                {value.map((item: any, index: number) => (
                    <button key={index} className="btn btn-light match-btn" onClick={() => { setSelectedMatch(item); setQueryKey(index + 1); }}>Match {index}</button>
                ))}
            </div>
            <div id="match-details" className="d-flex flex-col justify-content-evenly">
                <div id="match-content">
                    <div className="d-flex flex-col justify-content-evenly">
                        <div className="match-team1">
                            <Link to={`/team/${selectedMatch?.title.Team1}/${tournamentName}`}>
                                <h1>{selectedMatch ? selectedMatch.title.Team1 : "No Team 1 Found"}</h1>
                            </Link>
                        </div>
                        <div className="match-team2">
                            <Link to={`/team/${selectedMatch?.title.Team2}/${tournamentName}`}>
                                <h1>{selectedMatch ? selectedMatch.title.Team2 : "No Team 2 Found"}</h1>
                            </Link>
                        </div>
                    </div>
                    <div id="match-bans" className="d-flex flex-row gap-5 justify-content-evenly">
                        {selectedMatch ? championList(selectedMatch.title.Team1Bans) : "Fetching Team 1 Bans"}
                        {selectedMatch ? championList(selectedMatch.title.Team2Bans) : "Fetching Team 2 Bans"}
                    </div>
                    {selectedMatch ? <Objectives selectedMatch={selectedMatch} /> : "Failed to display objectives"}
                    <div className="d-flex flex-col gap-5 justify-content-evenly match-container">
                        <div>
                            {teams ? teams.get(selectedMatch?.title.Team1).map((item: any) => (
                                <div className="match-team-details1" key={`${item.title.Name}`}>
                                    <span>{item.title.Kills}/</span>
                                    <span>{item.title.Deaths}/</span>
                                    <span>{item.title.Assists}</span>
                                    <span> CS: {item.title.CS}</span>
                                    <span> Gold: {item.title.Gold} </span>
                                    <span> {item.title.Name}</span>
                                    <span>{championList(item.title.Champion)}</span>
                                    <div className="d-flex flex-wrap player-items justify-content-evenly">
                                        {item.title.Items.split(";").map((val: string, idx: number) => (
                                            <ItemImage key={idx} item={val} />
                                        ))}
                                    </div>
                                    <span><ItemImage item={item.title.Trinket} /></span>
                                    <div className="d-flex flex-wrap player-items">
                                        {item.title.SummonerSpells.split(",").map((val: string, idx: number) => (
                                            <SummonerImage key={idx} spell={val} />
                                        ))}
                                    </div>
                                </div>
                            ))
                                : "Loading"}
                        </div>
                        <div>
                            {teams ? teams.get(selectedMatch?.title.Team2).map((item: any) => (
                                <div className="match-team-details2" key={`${item.title.Name}`}>
                                    <span>{item.title.Kills}/</span>
                                    <span>{item.title.Deaths}/</span>
                                    <span>{item.title.Assists}</span>
                                    <span> CS: {item.title.CS}</span>
                                    <span> Gold: {item.title.Gold} </span>
                                    <span> {item.title.Name}</span>
                                    <span>{championList(item.title.Champion)}</span>
                                    <div className="d-flex flex-wrap player-items">
                                        {item.title.Items.split(";").map((val: string, idx: number) => (
                                            <ItemImage key={idx} item={val} />
                                        ))}
                                    </div>
                                    <span><ItemImage item={item.title.Trinket} /></span>
                                    <div className="d-flex flex-wrap player-items">
                                        {item.title.SummonerSpells.split(",").map((val: string, idx: number) => (
                                            <SummonerImage key={idx} spell={val} />
                                        ))}
                                    </div>
                                </div>
                            ))
                                : "Loading"}
                        </div>
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
    return (<></>);
}

export default MatchDetails;

