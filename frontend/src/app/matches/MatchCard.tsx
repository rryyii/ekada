import { Link } from "react-router";

/**
 * Returns a component for a list of match cards according to the current selected league.
 *
 * @param matches Data holding the current list of matches for the selected league.
 * @param tournamentName A string of the current tournament.
 * @category Match
 */
function MatchCard({ matches }: { matches: any }) {

    if (matches == null) {
        console.error("No valid values passed to MatchCard");
        return;
    }

    return (
        <div>
            <div className="card-container">
                <Link id="matchCard" className="row justify-content-center align-items-center" to={`/match_details/${encodeURIComponent(matches.SeriesKey)}`}>
                    <div className="col">
                        <img src={`/assets/teams/${matches.Team1}.png`} loading="lazy" className="team-logo" />
                    </div>
                    <div className="col d-flex gap-3">
                        <p>{matches.Team1Score}</p>
                        <p>-</p>
                        <p>{matches.Team2Score}</p>
                    </div>
                    <div className="col">
                        <img src={`/assets/teams/${matches.Team2}.png`} loading="lazy" className="team-logo" />
                    </div>
                </Link>
            </div>

        </div>
    );
}

export default MatchCard;