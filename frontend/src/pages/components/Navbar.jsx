import React, { useState, useEffect } from "react";
import Logo from '../welcomePage/assets/iconList.png'
import { Link } from "react-router-dom";

const Navbar = () => {
    const token = localStorage.getItem('token');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [userName, setUserName] = useState('');
    
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
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

                    if (responseData && responseData.username) {
                        setUserName(responseData.username);
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
            <div className="headerLogoName">
                <Link to={"/"}>
                    <img src={Logo} width={30} />
                    <h1>{userName}</h1>
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
