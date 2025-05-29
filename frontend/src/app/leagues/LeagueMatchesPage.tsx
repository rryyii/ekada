import { useParams } from "react-router";
import Standings from "./StandingsPage.tsx";
import MatchCard from "../matches/MatchCard.tsx";
import { groupMatchesIntoSeries } from "../util/match-series.tsx";
import {
    useQuery,
} from '@tanstack/react-query'

/**
 * Returns a component that lists both the current and future match schedule for the current league. Also calls the Standings component.
 *
 * @category League
 */
function Leagues() {
    const params = useParams();
    const leagueName: string | undefined = params.leagueName;
    const currentYear = new Date().getFullYear();
    const path = `${leagueName} ${currentYear}`;

    const { isPending, error, data } = useQuery({
        queryKey: [`leagueData-${leagueName}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/match_schedule/${path}`).then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (data) {
        const [series, future, op, tName] = groupMatchesIntoSeries(data);
        return (
            <div className="d-flex flex-column">
                <LeagueBanner leagueName={leagueName || "Unknown League"} tournamentName={tName}/>
                <div className="d-flex p-2 justify-content-around">
                    <div>
                        <MatchDayList series={series} tournamentName={tName} />
                    </div>
                    <div>
                        <Standings leagueName={op} tournamentName={tName} />
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
function MatchDayList({ series, tournamentName}: { series: any ; tournamentName: string}) {
    return (
        <div>
            {[...series.entries()].map(([key, value], index) => (
                <div key={`${index} - ${key}`} className="container">
                    <div>
                        <span className="date-text">{key}</span>
                        <MatchCard matches={value} tournamentName={tournamentName}/>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * Returns a component that includes any relevant information for the current league. 
 *
 * @param leagueName A string of the current league name.
 * @param tournamentName A string of the current tournament.
 * @category League
 */
function LeagueBanner({ leagueName, tournamentName}: { leagueName: string; tournamentName: string}) {
    return (
        <div id="leagueBanner" className="team-card">
            <div>
                <div>
                    <h1>{leagueName}</h1>
                    <h3>{tournamentName}</h3>
                </div>
            </div>
        </div>
    );
}

export default Leagues;