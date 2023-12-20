import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import Register from "./register/Register";
import Login from "./login/Login";
import wave from './assets/wave (2).svg';
import './components/style.css';
import logo from '../welcomePage/assets/iconList.png';

const Auth = () => {
    const [isLoginVisible, setLoginVisible] = useState(false);
    const [transitionClass, setTransitionClass] = useState(''); // Estado para controlar a classe de transição

    const toggleForm = () => {
        setTransitionClass('fade-out'); // Adiciona a classe de transição para fade-out
        setTimeout(() => {
            setLoginVisible(!isLoginVisible);
            setTransitionClass('fade-in'); // Adiciona a classe de transição para fade-in após um pequeno atraso
        }, 200); // Ajuste conforme necessário, tempo suficiente para a animação de fade-out
    };

    useEffect(() => {
        setTransitionClass('fade-in'); // Adiciona a classe de transição para fade-in quando o componente é montado
    }, []);

    return (
        <main className={`authMain ${transitionClass}`}>
            <div className="logo"><Link to={"/welcome"}><img src={logo} alt="logo" /></Link></div>
            {isLoginVisible ? <Login toggleForm={toggleForm} /> : <Register toggleForm={toggleForm} />}

            <div className="WelcomeDescWave">
                <img src={wave} alt="" />
            </div>
        </main>
    );
};

export default Auth;
