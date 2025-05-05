import { Link } from "react-router";

function MatchCard({ matches }: { matches: any }) {
    const series = new Map();
    for (const match of matches) {
        if (series.get(match.title.MatchId)) {
            const current = series.get(match.title.MatchId)
            current.push(match)
        } else {
            series.set(match.title.MatchId, [match])
        }
    }
    return (
        <div>
            {[...series.entries()].map(([key, value], index) => (
                <div key={`${index} - ${key}`} className="d-flex">
                    <div id="matchCard" className="d-flex justify-content-center">
                        <div className="d-flex">
                            <Link to={"/match_details"} state={value}>
                                <span>{value[0].title.Team1} </span>
                                <span>{value[0].title.Team1Score}</span>
                                -
                                <span>{value[0].title.Team2Score} </span>
                                <span>{value[0].title.Team2}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default MatchCard;