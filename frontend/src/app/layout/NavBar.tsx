import { Fragment } from "react";
import React from "react";
import { Link } from "react-router";
import Search from "./SearchFunction.js"

function NavBar() {
    return (
            <nav className="navbar navbar-expand-lg">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            Home
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link to="/" className="nav-link">
                            About
                        </Link>
                    </li>
                    <Search />
                </ul>
            </nav>
    );
}

export default NavBar;