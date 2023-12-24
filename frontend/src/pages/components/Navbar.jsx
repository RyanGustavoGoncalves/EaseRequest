import React from "react";
import './style/style.css';
import Logo from '../welcomePage/assets/iconList.png'
import { Link } from "react-router-dom";

const Navbar = () => {
    return(
        <header>
            <div className="headerLogoName">
                <Link to={"/"}>
                    <img src={Logo} width={30}/>
                    <h1>RequestEase</h1>
                </Link>
            </div>
            <nav>
                <ul>
                    <Link to={"/Welcome"}>
                        Welcome    
                    </Link>             
                    <Link to={"/Welcome"}>
                        Welcome    
                    </Link>             
                    <Link to={"/Welcome"}>
                        Welcome    
                    </Link>             
                </ul>
            </nav>
        </header>
    )

    
}
export default Navbar;