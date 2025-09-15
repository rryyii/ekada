import { useParams } from "react-router";
import Standings from "./LeagueStandingsPage.tsx";
import MatchCard from "../matches/MatchCard.tsx";
import { useState } from "react";
import { groupMatchesIntoSeries } from "../util/match-series.tsx";
import {
    useQuery,
} from '@tanstack/react-query'

/**
 * Returns a component that lists both the current and future match schedule for the current league. 
 * Also calls the Standings component to display (if exists) standings for the tournament.
 *
 * @category League
 */
function Leagues() {
    const params = useParams();
    const leagueName: string | undefined = params.leagueName;
    const currentYear = new Date().getFullYear();
    const [selectedTournament, setSelectedTournament] = useState<any>();
    const [tournamentString, setTournamentString] = useState<string>();
    const path = `${leagueName} ${currentYear}`;

    const { isPending, error, data } = useQuery({
        queryKey: [`leagueData-${leagueName}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/match_schedule/${path}`)
            .then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (data) {
        const [series, future, tName, international] = groupMatchesIntoSeries(data);

        return (
            <div className="d-flex flex-column">
                <div id="leagueBanner" className="team-card shadow">
                    <div className="d-flex align-items-center gap-3">
                        <h1>{leagueName}</h1>
                        <img src={`/assets/${leagueName}.png`} className="league-logo" alt="league-logo"/>
                    </div>
                    <div className="card-divider"></div>
                    <div>
                        {!international ? [...series.entries()].map(([key, value, idx]) => (
                            <button key={`${idx}-${key}`} onClick={() => {
                                setSelectedTournament(value); setTournamentString(value.values().next().value[0].title.OverviewPage)
                            }} className="btn btn-text">{key}
                            </button>
                        )) : ""}
                    </div>
                </div>
                <div className="d-flex p-2 justify-content-around">
                    <div>
                        {selectedTournament ? <MatchDayList series={selectedTournament} tournamentName={tName} /> : ""}
                        {international ? <MatchDayList series={series} tournamentName={tName} /> : ""}
                    </div>
                    <div>
                        {selectedTournament ? <Standings leagueName={tournamentString ?? ""} /> : ""}
                    </div>
                </div>
            </div>);

    }
}

/**
 * Returns a component that displays the past and current series of the current league.
 *
 * @param series Data including the current leagues' series.
 * @param tournamentName A string of the current tournament.
 * @category League
 */
function MatchDayList({ series, tournamentName }: { series: Map<String, Array<any>>; tournamentName: string }) {
    return (
        <div className="d-flex flex-column gap-4">
            {[...series.entries()].map(([key, value], index) => (
                <div key={`${index} - ${key}`} className="container d-flex flex-column gap-1">
                    <h2>{key}</h2>
                    <MatchCard matches={value} tournamentName={tournamentName} />
                </div>
            ))}
        </div>
    );
}

export default Leagues;