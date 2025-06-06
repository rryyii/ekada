import {
    useQuery,
} from '@tanstack/react-query'
import { Link } from "react-router";

/**
 * Returns a component that displays the current league's standings, including (wins, losses, and number). 
 *
 * @param leagueName  A string of the current league.
 * @param tournamentName A string of the current tournament.
 * @category League
 */
function Standings({ leagueName, tournamentName}: { leagueName: string ; tournamentName: string}) {
    const { isPending, error, data } = useQuery({
        queryKey: [`standingData-${leagueName}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/leagues/standings/${encodeURIComponent(leagueName)}`).then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (data && data.cargoquery.length > 0) {
        return (
            <div>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Team</th>
                            <th scope="col">Record</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.cargoquery.map((item: { title: { Place: string, Team: string, WinSeries: string, LossSeries: string } }) => (
                            <tr key={`${item.title.Place} - ${item.title.Team}`}>
                                <td>{item.title.Place}</td>
                                <td>
                                    <Link to={`/team/${encodeURIComponent(item.title.Team)}/${encodeURIComponent(tournamentName)}`}>
                                        {item.title.Team}
                                    </Link>
                                </td>
                                <td>{item.title.WinSeries} - {item.title.LossSeries}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Standings;