import { useLocation, Link } from "react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { championList } from "../util/champion-images";
import { groupPlayersIntoTeams, MatchData } from "../util/match-series";
import Objectives from "../matches/MatchObjectives";
import MatchTeamTable from "./MatchTeamTable";

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

    const { data, error } = useQuery({
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

    if (error) return `Error occured when fetching match details: ${error.message}`;

    if (data) {
        return (
            <div className="d-flex flex-column">
                <div id="match-details" className="d-flex flex-col justify-content-evenly">
                    <div id="match-content">
                        <div className="match-btns">
                            {value.map((item: any, index: number) => (
                                <button key={index} className="btn btn-light match-btn" onClick={() => { setSelectedMatch(item.title); setQueryKey(index + 1); }}>{index + 1}</button>
                            ))}
                            <a className="btn match-btn" target="_blank" href={selectedMatch ? selectedMatch.VOD : "Loading"}>
                                VOD
                            </a>
                        </div>
                        <div className="d-flex flex-col justify-content-around">
                            <div className="match-team1 d-flex align-items-center gap-2">
                                <Link to={`/team/${selectedMatch?.Team1}/${tournamentName}`}>
                                    <img src={`/assets/teams/${value[0].title.Team1}.png`} loading="lazy" className="team-logo" />
                                </Link>
                                <h4>{value[0].title.Team1}</h4>
                            </div>
                            <div className="match-team2 d-flex align-items-center gap-2">
                                 <h4>{value[0].title.Team2}</h4>
                                <Link to={`/team/${selectedMatch?.Team2}/${tournamentName}`}>
                                    <img src={`/assets/teams/${value[0].title.Team2}.png`} loading="lazy" className="team-logo" />
                                </Link>
                            </div>
                        </div>
                        <div className="d-flex flex-column gap-3 p-2">
                            <div id="match-bans" className="d-flex flex-row justify-content-around align-items-center">
                                {selectedMatch ? championList(selectedMatch.Team1Bans) : "Fetching Team 1 Bans"}
                                <h4>Bans</h4>
                                {selectedMatch ? championList(selectedMatch.Team2Bans) : "Fetching Team 2 Bans"}
                            </div>
                            {selectedMatch ? <Objectives selectedMatch={selectedMatch} /> : "Failed to display objectives"}
                        </div>
                        <div className="d-flex p-5 flex-col gap-3 match-container flex-wrap">
                            {teams && selectedMatch ? <MatchTeamTable selectedMatch={selectedMatch}
                                team={selectedMatch?.Team1}
                                teams={teams?.get(selectedMatch?.Team1)} /> : ""}
                            <hr></hr>
                            {teams && selectedMatch ? <MatchTeamTable selectedMatch={selectedMatch}
                                team={selectedMatch?.Team2}
                                teams={teams?.get(selectedMatch?.Team2)} /> : ""}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MatchDetails;

