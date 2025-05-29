import { Link } from "react-router";

/**
 * Returns a component for a list of match cards according to the current selected league.
 *
 * @param matches Data holding the current list of matches for the selected league.
 * @param tournamentName A string of the current tournament.
 * @category Match
 * 
 */
function MatchCard({ matches, tournamentName }: { matches: any ; tournamentName: string }) {
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
                            <Link to={"/match_details"} state={{value, tournamentName}}>
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