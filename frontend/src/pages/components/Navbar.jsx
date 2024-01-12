import { useState, useEffect } from "react";
import Logo from '../welcomePage/assets/iconList.png';
import user from './assets/user.png';
import { Link } from "react-router-dom";
import { FetchUser } from "../home/components/utils/getInfoUser/FetchUser";

const Navbar = () => {
    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState({});

    const isActive = (path) => {
        return location.pathname === path;
    };

    useEffect(() => {
        FetchUser(token, setUserData);
    }, [token]);

    useEffect(() => {
    }, [userData.profileImage]);

    return (
        <header>
            <nav className="navSup">
                <div className="headerLogoName">
                    <Link to={"/"}>
                        <img src={Logo} width={30} />
                    </Link>
                    <div className="userPerfil">
                        <Link to={"/Settings"}>
                            <img
                                src={userData.profileImage ? `data:image/png;base64,${userData.profileImage}` : user}
                                alt="userImage"
                                width={30}
                            />
                            <h1>{userData.username}</h1>
                        </Link>
                    </div>
                </div>
                <div className="scroll">
                    <nav className={"show"}>
                        <ul>
                            <li key="overview">
                                <Link to={"/"} className={isActive("/") ? "active" : "noActive"}>
                                    Overview
                                </Link>
                            </li>
                            <li key="welcome">
                                <Link to={"/Welcome"} className={isActive("/Welcome") ? "active" : "noActive"}>
                                    Welcome
                                </Link>
                            </li>

                        </ul>
                        <ul>
                            <li key="overview">
                                <Link to={"/Settings"} className={isActive("/Settings") ? "active" : "noActive"}>
                                    settings
                                </Link>
                            </li>
                        </ul>
                    </nav>
                </div>
            </nav>

        </header>
    );
}

export default Navbar;
