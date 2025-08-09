import {
    useQuery,
} from '@tanstack/react-query'

import { StandingsData } from '../util/match-series';

/**
 * Returns a component that displays the current league's standings, including (wins, losses, and number). 
 *
 * @param leagueName  A string of the current league.
 * @param tournamentName A string of the current tournament.
 * @category League
 */
function Standings({ leagueName }: { leagueName: string }) {
    const { isPending, error, data } = useQuery({
        queryKey: [`standingData-${leagueName}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/leagues/standings/${encodeURIComponent(leagueName)}`)
            .then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (data && data.cargoquery.length > 0) {
        return (
                <table className="standings-table">
                    <thead>
                        <tr>
                            <th scope="col"></th>
                            <th scope="col">Team</th>
                            <th scope="col">Record</th>
                            <th scope="col">Streak</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.cargoquery.map((item: { title: StandingsData}) => (
                            <tr key={`${item.title.Place} - ${item.title.Team}`}>
                                <td>{item.title.Place}</td>
                                <td>{item.title.Team}</td>
                                <td>{item.title.WinSeries} - {item.title.LossSeries}</td>
                                <td>{item.title.Streak} {item.title.StreakDirection}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        );
    }
}

export default Standings;