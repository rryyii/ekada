import {
    useQuery,
} from '@tanstack/react-query'
import { Link } from 'react-router';

import { StandingsData } from '../util/match-series';

/**
 * Returns a component that displays the current league's standings, including (wins, losses, and number). 
 *
 * @param leagueName  A string of the current league.
 * @param tournamentName A string of the current tournament.
 * @category League
 */
function Standings({ leagueName }: { leagueName: string }) {
    const { error, data } = useQuery({
        queryKey: [`standingData-${leagueName}`],
        queryFn: () => fetch(`http://localhost:8000/leagues/standings/${encodeURIComponent(leagueName)}`)
            .then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (error) return 'An error has occurred: ' + error.message;

    if (data && data.length > 0) {
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
                    {data.map((item: StandingsData) => (
                        <tr key={`${item.Place} - ${item.Team}`}>
                            <td>{item.Place}</td>
                            <td>
                                <Link to={`/team/${encodeURIComponent(item.Team)}/${encodeURIComponent(leagueName)}`}>
                                    <img src={`/assets/teams/${item.Team}.png`} loading="lazy" className="team-logo" />
                                </Link>
                            </td>
                            <td>{item.WinSeries} - {item.LossSeries}</td>
                            <td>{item.Streak} {item.StreakDirection}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    }
}

export default Standings;