import React, { useState } from "react";
import './style/style.css';
import Logo from '../welcomePage/assets/iconList.png'
import { Link } from "react-router-dom";

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <header>
            <div className="headerLogoName">
                <Link to={"/"}>
                    <img src={Logo} width={30} />
                    <h1>RequestEase</h1>
                </Link>
            </div>
            <div className="responsiveMenu">
                <div className="menu-icon" onClick={toggleMenu}>
                    &#9776;
                </div>
                <nav className={isMenuOpen ? "show" : ""}>
                    <ul>
                        <Link to={"/Welcome"}>
                            Overview
                        </Link>
                        <Link to={"/Welcome"}>
                            Welcome
                        </Link>
                        <Link to={"/Welcome"}>
                            Welcome
                        </Link>
                    </ul>
                </nav>
            </div>
        </header>
    );
}

export default Navbar;
