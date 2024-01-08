import { useState, useEffect } from "react";
import Logo from '../welcomePage/assets/iconList.png';
import user from './assets/user.png';
import { Link } from "react-router-dom";

const Navbar = () => {
    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState({});

    const isActive = (path) => {
        return location.pathname === path;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("http://localhost:8080/user/token", {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    const responseData = await response.json();

                    if (responseData && responseData) {
                        setUserData(responseData);
                    } else {
                        console.error("A resposta não contém um nome de usuário válido:", responseData);
                    }
                } else {
                    console.log("Ocorreu um erro inesperado ao buscar as informações do usuário: " + response.status);
                }
            } catch (error) {
                console.log("Erro ao buscar as informações do usuário:", error);
                alert("Erro ao buscar as informações do usuário. Por favor, tente novamente mais tarde.");
            }
        };

        fetchData();
    }, [token]);

    return (
        <header>
            <nav className="navSup">
                <div className="headerLogoName">
                    <Link to={"/"}>
                        <img src={Logo} width={30} />
                    </Link>
                    <div className="userPerfil">
                        <img src={user} alt="userImage" width={30} style={{ filter: "invert(1)" }} />
                        <h1>{userData.username}</h1>
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
                                <Link to={"/Settings"} className={isActive("/settings") ? "active" : "noActive"}>
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
