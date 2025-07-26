import { Link } from "react-router";

/**
 * Returns a component for a list of match cards according to the current selected league.
 *
 * @param matches Data holding the current list of matches for the selected league.
 * @param tournamentName A string of the current tournament.
 * @category Match
 */
function MatchCard({ matches, tournamentName }: { matches: any; tournamentName: string }) {
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
                <div key={`${index} - ${key}`}>
                    <Link id="matchCard" className="d-flex justify-content-around match-link align-items-center" to={"/match_details"} state={{ value, tournamentName }}>
                        <div>
                            <span>{value[0].title.Team1} </span>
                        </div>
                        <div className="match-link-score d-flex gap-2">
                            <span>{value[0].title.Team1Score}</span>
                            <div>|</div>
                            <span>{value[0].title.Team2Score}</span>
                        </div>
                        <div>
                            <span>{value[0].title.Team2}</span>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default MatchCard;