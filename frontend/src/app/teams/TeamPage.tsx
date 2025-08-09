import { useParams } from "react-router";
import {
    useQuery,
} from '@tanstack/react-query'
import { parsePlayersIntoRoles } from "../util/match-series";

/**
 * Returns a component that retrieves and displays relevant data, including roster, of the selected e-sports team.
 *
 * @category Team 
 */
function Team() {
    const params = useParams();
    const teamName = params.teamName;
    const leagueName = params.leagueName;
    const enabled = !!teamName && !!leagueName;

    const { isPending, error, data } = useQuery({
        queryKey: [`teamData-${teamName ?? ""}-${leagueName ?? ""}`],
        queryFn: () => fetch(
            `http://localhost:${import.meta.env.VITE_APP_PORT}/api/team_info/${encodeURIComponent(teamName as string)}/${encodeURIComponent(leagueName as string)}`
        ).then((res) => res.json()),
        enabled,
    });

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if (data) {
        const [players, coaches]: Array<Map<Array<string>, Array<string>>> = parsePlayersIntoRoles(data.cargoquery[0].title.RosterLinks, data.cargoquery[0].title.Roles);
        return (
            <div className="d-flex flex-column align-items-center shadow">
                <div className="d-flex flex-row gap-3 team-card">
                    <h1>{teamName}</h1>
                    <img className="team-logo" src={`/assets/teams/${teamName}.png`} loading="lazy" alt={`${teamName} Logo`}/>
                    <p>{data.cargoquery[0].title.Region}</p>
                </div>
                <div className="d-flex flex-row gap-3 player-roster justify-content-evenly">
                    {Array.from(players).map(([key, value], idx) =>
                        <div key={idx}>
                            <div>{key}</div>
                            <div>{value}</div>
                        </div>
                    )
                    }
                </div>
                    <div className="d-flex flex-row gap-3 player-roster justify-content-evenly">
                    {Array.from(coaches).map(([key, value], idx) =>
                        <div key={idx}>
                            <div>{key}</div>
                            <div>{value}</div>
                        </div>
                    )
                    }
                </div>
            </div>
        );
    }

}


export default Team;