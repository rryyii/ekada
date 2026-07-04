import { Link } from "react-router";

/**
 * Returns a component including links to the currently managed leagues (LPL, LTA N, LTA S, LEC, and LCK).
 *
 * @category League
 */
function MainPage() {
    return (
        <div className="container">
            <div className="row">
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LCK"} >
                        <img src="/assets/LCK.png" alt="lck logo" className="league-logo" />
                    </Link>
                    <h4>LCK</h4>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LPL"} >
                        <img src="/assets/LPL.png" alt="lpl logo" className="league-logo" />
                    </Link>
                    <h4>LPL</h4>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LEC"} >
                        <img src="/assets/LEC.png" alt="lec logo" className="league-logo" />
                    </Link>
                    <h4>LEC</h4>
                </div>
            </div>
            <div className="row">
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LCS"} >
                        <img src="/assets/LCS_2024.png" alt="lta n logo" className="league-logo" />
                    </Link>
                    <h4>LCS</h4>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LCP"} >
                        <img src="/assets/LCP.png" alt="lcp logo" className="league-logo" />
                    </Link>
                    <h4>LCP</h4>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "CBLOL"} >
                        <img src="/assets/CBLOL.png" alt="lcp logo" className="league-logo" />
                    </Link>
                    <h4>CBLOL</h4>
                </div>
            </div>
            <div className="row">
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "First Stand"} >
                        <img src="/assets/First Stand.png" alt="first stand logo" className="league-logo" />
                    </Link>
                    <h4>First Stand</h4>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "MSI"} >
                        <img src="/assets/MSI.png" alt="msi logo" className="league-logo" />
                    </Link>
                    <h4>MSI</h4>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "Worlds"} >
                        <img src="/assets/Worlds.png" alt="worlds logo" className="league-logo" />
                    </Link>
                    <h4>Worlds</h4>
                </div>
            </div>
        </div>
    );
}

export default MainPage;