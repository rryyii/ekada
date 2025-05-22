import React from "react";
import { Link } from "react-router";

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
                        <img alt="LCK Logo" loading="lazy" src={leagues.LCK}></img>
                    </Link>
                </div>
                <div className="col league-div">
                    <Link to={"/leagues/" + "LPL"} >
                        <img alt="LPL Logo" loading="lazy" src={leagues.LPL}></img>
                    </Link>
                </div>
                <div className="col league-div">
                    <Link to={"/leagues/" + "LEC"} >
                        <img alt="LEC Logo" loading="lazy" src={leagues.LEC}></img>
                    </Link>
                </div>
            </div>
            <div className="row">
                <div className="col league-div">
                    <Link to={"/leagues/" + "LTA North"} >
                        <img alt="LTA North Logo" loading="lazy" src={leagues["LTA North"]}></img>
                    </Link>
                </div>
                <div className="col league-div">
                    <Link to={"/leagues/" + "LTA South"} >
                        <img alt="LTA South Logo" loading="lazy" src={leagues["LTA South"]}></img>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default MainPage;
