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
                        <img src="/assets/LCK.png" alt="lck logo" className="league-logo"/>
                    </Link>
                    <h1>LCK</h1>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LPL"} >
                        <img src="/assets/LPL.png" alt="lpl logo" className="league-logo"/>
                    </Link>
                    <h1>LPL</h1>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LEC"} >
                        <img src="/assets/LEC.png" alt="lec logo" className="league-logo"/>
                    </Link>
                    <h1>LEC</h1>
                </div>
            </div>
            <div className="row">
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LTA North"} >
                        <img src="/assets/LTA North.png" alt="lta n logo" className="league-logo"/>
                    </Link>
                    <h1>LTA North</h1>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "LTA South"} >
                        <img src="/assets/LTA South.png" alt="lta s logo" className="league-logo"/>
                    </Link>
                    <h1>LTA South</h1>
                </div>
            </div>
            <div className="row">
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "First Stand"} >
                        <img src="/assets/First Stand.png" alt="first stand logo" className="league-logo"/>
                    </Link>
                    <h1>First Stand</h1>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "MSI"} >
                        <img src="/assets/MSI.png" alt="msi logo" className="league-logo"/>
                    </Link>
                    <h1>MSI</h1>
                </div>
                <div className="col league-div shadow">
                    <Link to={"/leagues/" + "Worlds"} >
                        <img src="/assets/Worlds.png" alt="worlds logo" className="league-logo"/>
                    </Link>
                    <h1>Worlds</h1>
                </div>
            </div>
        </div>
    );
}

export default MainPage;