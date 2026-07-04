import { useLocation, Link, useParams } from "react-router";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { championList } from "../util/champion-images";
import { groupMatches, groupPlayersIntoTeams } from "../util/match-series";
import Objectives from "../matches/MatchObjectives";
import MatchTeamTable from "./MatchTeamTable";

/**
 * Returns a component that displays necessary details for a selected match.
 * 
 * @category Match
 */
function MatchDetails() {
    const { id } = useParams();
    const [selectedMatch, setSelectedMatch] = useState<any>();
    const [teams, setTeams] = useState<any>();
    const [matches, setMatches] = useState<any>();
    const [queryKey, setQueryKey] = useState<number>(0);

    const { data, error } = useQuery({
        queryKey: [`matchData`, id, queryKey],
        queryFn: () => fetch(`http://localhost:8000/leagues/game_data/${encodeURIComponent(id ?? "")}`)
            .then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    })

    useEffect(() => {
        if (data) {
            setTeams(groupPlayersIntoTeams(data));
            setMatches(groupMatches(data));
        }
    }, [data])

    if (error) return `Error occured when fetching match details: ${error.message}`;

    if (data && matches && teams) {
        return (
            <div className="d-flex flex-column">
                <div id="match-details" className="d-flex flex-col justify-content-evenly">
                    <div id="match-content">
                        <div className="match-btns">
                            {[...matches.entries()].map(([key, value], index) => (
                                <button key={`${key}-${value}-${index}`} className="btn btn-light match-btn" onClick={() => { setSelectedMatch(value); }}>{index + 1}</button>
                            ))}
                        </div>
                        <div className="d-flex flex-column gap-3 p-2">
                            {selectedMatch ? <Objectives selectedMatch={selectedMatch[0].GameId} teams={teams}/> : "Failed to display objectives"}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MatchDetails;

