import {
    useQuery,
} from '@tanstack/react-query'
import { Link } from "react-router";

function Standings({ leagueName }: { leagueName: string }) {
    const { isPending, error, data } = useQuery({
        queryKey: [`standingData-${leagueName}`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/leagues/standings/${encodeURIComponent(leagueName)}`).then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (isPending) return 'Loading...';

    if (error) return 'An error has occurred: ' + error.message;

    if (data) {
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
                        <StandingData data={data} />
                    </tbody>
                </table>
            </div>
        );
    }
}

function StandingData({ data }: { data: any }) {
    return (
        <>
            {data.cargoquery.map((item: { title: { Place: string, Team: string, WinSeries: string, LossSeries: string } }) => (
                <tr key={`${item.title.Place} - ${item.title.Team}`}>
                    <td>{item.title.Place}</td>
                    <td>
                        <Link to={"/team/" + item.title.Team}>
                            {item.title.Team}
                        </Link>
                    </td>
                    <td>{item.title.WinSeries} - {item.title.LossSeries}</td>
                </tr>
            ))}
        </>
    );
}

export default Standings;