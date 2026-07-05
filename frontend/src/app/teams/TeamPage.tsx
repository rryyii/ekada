import { useParams } from "react-router";
import {
    useQuery,
} from '@tanstack/react-query'
import { parsePlayersIntoRoles } from "../util/match-series";
import TeamRecentMatches from "./TeamRecentMatches";
import LeagueStatsPage from "../leagues/LeagueStatsPage";

/**
 * Returns a component that retrieves and displays relevant data, including roster, of the selected e-sports team.
 *
 * @category Team 
 */
function Team() {
    const params = useParams();
    const teamName = params.teamName;
    const leagueName = params.leagueName;

    const { isPending, error, data } = useQuery({
        queryKey: [`teamData-${teamName}-${leagueName}`],
        queryFn: () => fetch(
            `http://localhost:8000/teams/${encodeURIComponent(teamName as string)}/${encodeURIComponent(leagueName as string)}`
        ).then((res) => res.json()),
    });

    if (isPending) return 'Loading...'

    if (error) return 'An error has occurred: ' + error.message

    if (data) {
        const [players, coaches]: Array<Map<Array<string>, Array<string>>> = parsePlayersIntoRoles(data[0].RosterLinks, data[0].Roles);
        return (
            <div className="d-flex flex-column align-items-center shadow">
                <div className="d-flex flex-row gap-3 team-card">
                    <h1>{teamName}</h1>
                    <img className="team-logo" src={`/assets/teams/${teamName}.png`} loading="lazy" alt={`${teamName} Logo`} />
                </div>
                <div className="d-flex flex-row gap-3 player-roster justify-content-evenly">
                    {Array.from(players).map(([key, value], idx) =>
                        <div key={`players-${idx}-${key}`}>
                            <div>{key}</div>
                            <div>{value}</div>
                        </div>
                    )
                    }
                </div>
                <div className="d-flex flex-row gap-3 player-roster justify-content-evenly">
                    {Array.from(coaches).map(([key, value], idx) =>
                        <div key={`coaches-${idx}-${key}`}>
                            <div>{key}</div>
                            <div>{value}</div>
                        </div>
                    )
                    }
                </div>
                <div className="d-flex flex-row gap-3 p-3 player-roster">
                    <h5>Recent Series:</h5>
                    <TeamRecentMatches team={teamName ?? ""} split={leagueName ?? ""}/>
                </div>
                <div className="d-flex flex-row gap-3 p-3 player-roster">
                    <LeagueStatsPage tournamentString={leagueName ?? ""} team={teamName ?? ""} />
                </div>
            </div>
        );
    }

}


export default Team;