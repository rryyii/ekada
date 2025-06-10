import { Link } from "react-router";

/**
 * Returns a component including links to the currently managed leagues (LPL, LTA N, LTA S, LEC, and LCK).
 *
 * @category League
 */
function MainPage() {
    const leagues = {
        "LPL": "/assets/LPL_2020_logo.png",
        "LCK": "/assets/LCK_2021_logo.png",
        "LEC": "/assets/LEC-2019_logo.png",
        "LTA North": "/assets/LTA_North.png",
        "LTA South": "/assets/LTA_South.png"
    };

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
        </div>
    );
}

export default MainPage;
