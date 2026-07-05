import { useQuery } from "@tanstack/react-query";
import MatchCard from "../matches/MatchCard";

function TeamRecentMatches({ team, split }: { team: string, split: string }) {

    const { data, error, isPending } = useQuery(
        {
            queryKey: [`team-recent-${team}`, team, split],
            queryFn: () => fetch(`http://localhost:8000/teams/recent_matches/${encodeURIComponent(team)}/${encodeURIComponent(split)}`)
                .then((res) => res.json()),
        }
    )

    if (data) {
        return (
            <div className={"d-flex flex-row flex-wrap p-5"}>
                {data.map((match: any) => (
                    <div className="container d-flex flex-column gap-1 align-items-center">
                        <h5>{match.SplitKey}</h5>
                        <MatchCard matches={match} />
                    </div>
                )
                )}
            </div>
        )
    }
}

export default TeamRecentMatches;