import { Link } from "react-router";

/**
 * Returns a component for a list of match cards according to the current selected league.
 *
 * @param matches Data holding the current list of matches for the selected league.
 * @param tournamentName A string of the current tournament.
 * @category Match
 */
function MatchCard({ matches, tournamentName }: { matches: Array<any>; tournamentName: string }) {

    if (matches == null || tournamentName == null) {
        console.error("No valid values passed to MatchCard");
        return;
    }

    const series = new Map();
    for (const match of matches) {
        if (series.get(match.title.MatchId)) {
            const current = series.get(match.title.MatchId)
            current.push(match)
        } else {
            series.set(match.title.MatchId, [match])
        }
    }

    if (series.size == 0) { return "Empty series found." }
    
    return (
        <div>
            {[...series.entries()].map(([key, value], index) => (
                <div key={`${index} - ${key}`} className="card-container">
                    <Link id="matchCard" className="row justify-content-center align-items-center" to={"/match_details"} state={{ value, tournamentName }}>
                        <div className="col">
                            <img src={`/assets/teams/${value[0].title.Team1}.png`} loading="lazy" className="team-logo"/>
                        </div>
                        <div className="col d-flex gap-3">
                            <p>{value[0].title.Team1Score}</p>
                            <p>-</p>
                            <p>{value[0].title.Team2Score}</p>
                        </div>
                        <div className="col">
                            <img src={`/assets/teams/${value[0].title.Team2}.png`} loading="lazy" className="team-logo"/>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    );
}

export default MatchCard;