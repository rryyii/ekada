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
    const test = leagueName?.split(" ");
    let test2 = "";
    if (test) {
        test2 = test[0] + " " + test[1];
    }

    const enabled = !!teamName && !!leagueName;
    const { isPending, error, data } = useQuery({
        queryKey: [`teamData-${teamName ?? ""}-${leagueName ?? ""}`],
        queryFn: () => fetch(
            `http://localhost:${import.meta.env.VITE_APP_PORT}/api/team_info/${encodeURIComponent(teamName as string)}/${encodeURIComponent(leagueName as string)}`
        ).then((res) => res.json()),
        enabled,
    });

    // const { data: cacheData, isPending: isCachePending } = useQuery({
    //     queryKey: [`team-cache-${teamName}`],
    //     queryFn: () => fetch(
    //         `http://localhost:${import.meta.env.VITE_APP_PORT}/api/team_cache/${encodeURIComponent(teamName as string)}/${encodeURIComponent(test2 as string)}`
    //     ).then((res) => res.json()),
    //     enabled,
    // });

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if (data) {
        const players: Map<Array<string>, Array<string>> = parsePlayersIntoRoles(data.cargoquery[0].title.RosterLinks, data.cargoquery[0].title.Roles);
        return (
            <div>
                <div className="d-flex flex-column justify-content-center">
                    <div className="d-flex flex-column team-card">
                        <h1>{teamName}</h1>
                    </div>
                    <div className="d-flex flex-row gap-2">
                        {Array.from(players).map(([key, value], idx) =>
                            <div className="team-player" key={idx}>
                                <div>{key}</div>
                                <div>{value}</div>
                            </div>
                        )
                        }
                    </div>
                </div>
            </div>
        );
    }

}


export default Team;