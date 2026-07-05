import { useQuery } from "@tanstack/react-query"
import MatchCard from "./MatchCard";

function MatchDayList({ split }: { split: string }) {

    const { isPending, error, data } = useQuery({
        queryKey: [`leagueData-${split}`],
        queryFn: () => fetch(`http://localhost:8000/leagues/series/${encodeURIComponent(split)}`)
            .then((res) => res.json()),
        refetchOnWindowFocus: true,
        staleTime: 0,
    });

    if (data) {
        return (
            <div className="d-flex flex-column gap-4">
                {data.map((match: any) => (
                    <div key={`match-list-${match.SeriesKey}`} className="container d-flex flex-column gap-1">
                        <h2>{new Intl.DateTimeFormat('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                        }).format(new Date(match.Date.replace(' ', 'T')))}</h2>
                        <MatchCard matches={match} />
                    </div>
                )
                )}
            </div>
        )
    }

}

export default MatchDayList;