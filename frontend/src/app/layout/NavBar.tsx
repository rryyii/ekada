import { Link } from "react-router";
import Search from "./SearchFunction.js"

/**
 * Returns a component involving the navigation bar for the entire application.
 * 
 * @category Layout
 */
function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg p-3">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link to="/" className="nav-link">
                        Leagues
                    </Link>
                </li>
                <li className="nav-item">
                    <Link to="/leagues/LCK" className="nav-link">
                        LCK
                    </Link>
                </li>
                   <li className="nav-item">
                    <Link to="/leagues/LPL" className="nav-link">
                        LPL
                    </Link>
                </li>
                   <li className="nav-item">
                    <Link to="/leagues/LEC" className="nav-link">
                        LEC
                    </Link>
                </li>
                   <li className="nav-item">
                    <Link to="/leagues/LTA North" className="nav-link">
                        LTA N
                    </Link>
                </li>
                   <li className="nav-item">
                    <Link to="/leagues/LTA South" className="nav-link">
                        LTA S
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;