import { useQuery } from "@tanstack/react-query";
import { championList } from "../util/champion-images";

function LeagueStatsPage({ tournamentString }: { tournamentString: string }) {

    const { data, error } = useQuery({
        queryKey: [`${tournamentString}-stats`],
        queryFn: () => fetch(`http://localhost:${import.meta.env.VITE_APP_PORT}/api/leagues/data/${encodeURIComponent(tournamentString || "")}`)
            .then((res) => res.json())
    })

    if (error) return "Error occured fetching league statistics";

    if (data) {
        return (
            <div className={"leagueBanner"}>
                <h1>Champion Statistics</h1>
                <div className={"card-divider"}></div>
                <table className={"match-table"}>
                    <thead>
                        <tr>
                            <th>Champion</th>
                            <th>Picks</th>
                            <th>Win-rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item: any) => (
                            <tr className={""}>
                                <td className={"d-flex gap-3"}>
                                    <p>{championList(item.Champion)}</p>
                                    <p>{item.Champion}</p>
                                </td>
                                <td>{item.champion_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default LeagueStatsPage;