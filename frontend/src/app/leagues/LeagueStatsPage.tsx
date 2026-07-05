import { useQuery } from "@tanstack/react-query";
import { championList } from "../util/champion-images";

function LeagueStatsPage({ tournamentString }: { tournamentString: string }) {

    const { data, error } = useQuery({
        queryKey: [`${tournamentString}-stats`],
        queryFn: () => fetch(`http://localhost:8000/series/champion_stats/${encodeURIComponent(tournamentString || "")}`)
            .then((res) => res.json())
    })

    if (error) return "Error occured fetching league statistics";

    if (data) {
        return (
            <div>
                <div className={"leagueBanner"}>
                    <h1>Champion Statistics</h1>
                    <div className={"card-divider"}></div>
                    <table className={"match-table"}>
                        <thead>
                            <tr>
                                <th>Champion</th>
                                <th>Win-rate</th>
                                <th>Pick-count</th>
                                <th>AVG Kills</th>
                                <th>AVG Deaths</th>
                                <th>AVG Assists</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((item: any) => (
                                <tr className={""}>
                                    <td className={"d-flex gap-3"}>
                                        <p>{championList(item.Champion)}</p>
                                        <p>{item.Champion}</p>
                                    </td>
                                    <td>{(item.win_count / item.count).toFixed(2)}</td>
                                    <td>{item.count}</td>
                                    <td>{item.avg_kills.toFixed(2)}</td>
                                    <td>{item.avg_deaths.toFixed(2)}</td>
                                    <td>{item.avg_assists.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default LeagueStatsPage;