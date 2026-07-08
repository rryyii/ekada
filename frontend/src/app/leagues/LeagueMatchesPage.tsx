import { useParams } from "react-router";
import Standings from "./LeagueStandingsPage.tsx";
import MatchDayList from "../matches/MatchDayList.tsx"
import { useState } from "react";
import {
    useQuery,
} from '@tanstack/react-query'
import LeagueStatsPage from "./LeagueStatsPage.tsx";

/**
 * Returns a component that lists both the current and future match schedule for the current league. 
 * Also calls the Standings component to display (if exists) standings for the tournament.
 *
 * @category League
 */
function Leagues() {
    const params = useParams();
    const leagueName: string | undefined = params.leagueName;
    let isInternational = false;
    if (leagueName == "MSI" || leagueName == "Worlds" || leagueName == "First Stand") {
        isInternational = true;
    }
    const [selectedSplit, setSelectedSplit] = useState<any>();
    const [selectedName, setSelectedName] = useState<string>("");
    const path = `${leagueName}`;

    const { isPending, error, isError, data } = useQuery({
        queryKey: [`leagueData-${leagueName}`, leagueName],
        queryFn: () => fetch(`http://localhost:8000/leagues/split/${path}/${isInternational}`)
            .then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });


    if (isPending) return 'Loading...';

    if (isError) {
        console.log(error.name)
    }

    if (data && data.length > 0) {
        return (
            <div className="d-flex flex-column gap-5">
                <div className="leagueBanner team-card shadow">
                    <div className="d-flex align-items-center gap-3">
                        <h1>{leagueName}</h1>
                        <img src={`/assets/${leagueName}.png`} className="league-logo" alt="league-logo" />
                    </div>
                    <div className="card-divider"></div>
                    <div>
                        {[...data.entries()].map(([key, value, idx]) => (
                            <button key={`${idx}-${key}`} onClick={() => {
                                setSelectedName(value.Name);
                                setSelectedSplit(value)
                            }} className="btn btn-text">{value.Name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="d-flex p-2 justify-content-around">
                    <div>
                        {selectedName ? <MatchDayList split={selectedName ?? ""} /> : ""}
                    </div>
                    <div>
                        {selectedSplit ? <Standings leagueName={selectedSplit.OverviewPage ?? ""} /> : ""}
                    </div>
                </div>
                <div>
                    {selectedSplit ? <LeagueStatsPage tournamentString={selectedSplit.OverviewPage ?? ""} team={"None"} /> : ""}
                </div>
            </div>);

    } else {
        return (
            <div className="d-flex p-5">
                <h5>Failed to fetch any split data for {leagueName}</h5>
            </div>
        )
    }
}


export default Leagues;