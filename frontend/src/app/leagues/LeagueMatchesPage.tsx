import { useParams } from "react-router";
import Standings from "./StandingsPage.tsx";
import MatchCard from "../matches/MatchCard.tsx";
import { groupMatchesIntoSeries } from "../util/match-series.tsx";
import {
    useQuery,
} from '@tanstack/react-query'

function Leagues() {
    const params = useParams();
    const leagueName: string | undefined = params.leagueName;
    const currentYear = new Date().getFullYear();
    const path = `${leagueName} ${currentYear}`;

    const { isPending, error, data } = useQuery({
        queryKey: ['leagueData'],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/match_schedule/${path}`).then((res) => res.json()),
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (data) {
        const [series, future, op] = groupMatchesIntoSeries(data);
        return (
            <div className="d-flex flex-column">
                <LeagueBanner leagueName={leagueName || "Unknown League"} />
                <div className="d-flex p-2 justify-content-around">
                    <div>
                        <MatchDayList series={series} />
                    </div>
                    <div>
                    </div>
                    <div>
                        <Standings leagueName={op} />
                    </div>
                </div>
            </div>);

    }
}

function MatchDayList({ series }: { series: any }) {
    return (
        <div>
            {[...series.entries()].map(([key, value], index) => (
                <div key={`${index} - ${key}`} className="container">
                    <div>
                        <span className="date-text">{key}</span>
                        <MatchCard matches={value} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function LeagueBanner({ leagueName }: { leagueName: string }) {
    return (
        <div id="leagueBanner" className="team-card">
            <div>
                <div>
                    {leagueName}
                </div>
            </div>
            <div>

            </div>
        </div>
    );
}

export default Leagues;