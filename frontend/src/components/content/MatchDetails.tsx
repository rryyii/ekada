import { useLocation } from "react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { championList } from "../util/champion-images";
import { MatchData } from "../util/match-series";

function MatchDetails() {
    const location = useLocation();
    const datas = location.state;
    const [selectedMatch, setSelectedMatch] = useState<MatchData>();
    const [queryKey, setQueryKey] = useState(0);

    const { data } = useQuery({
        queryKey: ['matchData', selectedMatch?.title.MatchId, queryKey],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/match/${encodeURIComponent(selectedMatch?.title.MatchId)}/${queryKey}`).then((res) => res.json()),
        enabled: !!selectedMatch && !!queryKey,
    })

    return (
        <div className="container">
            <div>
                {datas.map((item: any, index: number) => (
                    <button key={index} className="btn btn-light match-btn" onClick={() => { setSelectedMatch(item); setQueryKey(index + 1) }}>Match {index}</button>
                ))}
            </div>
            <div id="match-details" className="d-flex flex-col justify-content-evenly">
                <div id="match-content">
                    <div className="d-flex flex-col justify-content-evenly">
                        <div>
                            <h1>{selectedMatch ? selectedMatch.title.Team1 : "No Team 1 Found"}</h1>
                        </div>
                        <div>
                            <h1>{selectedMatch ? selectedMatch.title.Team2 : "No Team 2 Found"}</h1>
                        </div>
                    </div>
                    <div id="match-bans" className="d-flex flex-row gap-5 justify-content-evenly">
                        {selectedMatch ? championList(selectedMatch.title.Team1Bans) : "Fetching Team 1 Bans"}
                        {selectedMatch ? championList(selectedMatch.title.Team2Bans) : "Fetching Team 2 Bans"}
                    </div>
                    {selectedMatch ? <Objectives selectedMatch={selectedMatch} /> : "Failed to display objectives"}
                    <div className="d-flex flex-col">
                    </div>
                    <div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Objectives({ selectedMatch }: { selectedMatch: MatchData }) {
    return (
        <div>
            
        </div>
    );
}

export default MatchDetails;

