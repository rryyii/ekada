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
                <div className="col league-div">
                    <Link to={"/leagues/" + "LCK"} >
                        <h1>LCK</h1>
                    </Link>
                </div>
                <div className="col league-div">
                    <Link to={"/leagues/" + "LPL"} >
                        <h1>LPL</h1>
                    </Link>
                </div>
                <div className="col league-div">
                    <Link to={"/leagues/" + "LEC"} >
                        <h1>LEC</h1>
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col league-div">
                    <Link to={"/leagues/" + "LTA North"} >
                        <h1>LTA North</h1>
                    </Link>
                </div>
                <div className="col league-div">
                    <Link to={"/leagues/" + "LTA South"} >
                        <h1>LTA South</h1>
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col league-div">
                    <Link to={"/leagues/" + "First Stand"} >
                        <h1>First Stand</h1>
                    </Link>
                </div>
                <div className="col league-div">
                    <Link to={"/leagues/" + "MSI"} >
                        <h1>MSI</h1>
                    </Link>
                </div>
                <div className="col league-div">
                    <Link to={"/leagues/" + "Worlds"} >
                        <h1>Worlds</h1>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
