import React from "react";
import './style/style.css';
import imgLogo from './assets/icons8-organização-24.png'
import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <header>
            <div className="headerLogoName">
                <img src={imgLogo} width={30}/>
                <h1>MainteXcel</h1>
            </div>
            <nav>
                <ul>
                    <Link to={"/"}>
                        teste    
                    </Link>       
                    <Link to={"/"}>
                        teste    
                    </Link>       
                    <Link to={"/"}>
                        teste    
                    </Link>       
                </ul>
            </nav>
        </header>
    )

    
}
export default Navbar;