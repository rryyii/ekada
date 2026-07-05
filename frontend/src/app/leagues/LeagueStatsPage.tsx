import { useQuery } from "@tanstack/react-query";
import { championList } from "../util/champion-images";
import { useState } from "react";

function LeagueStatsPage({ tournamentString, team = "None" }: { tournamentString: string, team: string}) {
    const [role, setRole] = useState<string>("default")
    return (
        <div className={"d-flex flex-column p-3 gap-3 align-items-center"}>
            <div className={`btn-group-horizontal`}>
                <button onClick={() => setRole("default")} className={`match-btn btn`}>All</button>
                <button onClick={() => setRole("Top")} className={`match-btn btn`}>Top</button>
                <button onClick={() => setRole("Jungle")} className={`match-btn btn`}>Jungle</button>
                <button onClick={() => setRole("Mid")} className={`match-btn btn`}>Mid</button>
                <button onClick={() => setRole("Bot")} className={`match-btn btn`}>Bot</button>
                <button onClick={() => setRole("Support")} className={`match-btn btn`}>Support</button>
            </div>
            <div>
                <Group tournamentString={tournamentString} role={role} team={team}/>
            </div>
        </div>
    )
}


function Group({ tournamentString, role, team = "None" }: { tournamentString: string, role: string, team: string}) {

    const { data, error } = useQuery({
        queryKey: [`${tournamentString}-stats-${role}`, tournamentString, role],
        queryFn: () => fetch(`http://localhost:8000/series/champion_stats/${encodeURIComponent(tournamentString || "")}/${encodeURIComponent(role)}/${encodeURIComponent(team)}`)
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
                                <tr key={`champion-stats-${item.Champion}`}>
                                    <td className={"d-flex gap-3"}>
                                        {championList(item.Champion)}
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