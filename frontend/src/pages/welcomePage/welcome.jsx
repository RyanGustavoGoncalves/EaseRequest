import React, { useEffect, useState } from "react";
import ScrollReveal from 'scrollreveal';
import './components/style.css';
import logo from './assets/iconList.png';
import WelcomeIntro from "../welcomeIntro/WelcomeIntro";
import WelcomeDescri from "../welcomeDescri/WelcomeDescri";
import WelcomeService from "../welcomeService/WelcomeService";
import WelcomeTecno from "../welcomeTecno/WelcomeTecno";

const welcome = () => {
    const [currentPage, setCurrentPage] = useState(1);

    // const nextPage = () => {
    //     setCurrentPage((prevPage) => (prevPage < 2 ? prevPage + 1 : 1));
    // };

    // const prevPage = () => {
    //     setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : 2));
    // };

    useEffect(() => {
        const sr = ScrollReveal();

        const calculateDistance = () => {
            // Lógica para calcular a distância com base em fatores responsivos
            return window.innerWidth > 768 ? '70px' : '15px';
        };
        sr.reveal('.logoWelcomeTxt', {
            origin: 'top',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });
        sr.reveal('.welcomeIntroArticle', {
            origin: 'left',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });
        sr.reveal('.animation', {
            origin: 'bottom',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });
        sr.reveal('.WelcomeTecnoArticle', {
            origin: 'bottom',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });
        sr.reveal('.tittleService', {
            origin: 'left',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });
    }, []);

    useEffect(() => {

        const sr = ScrollReveal();

        const calculateDistance = () => {
            // Lógica para calcular a distância com base em fatores responsivos
            return window.innerWidth > 768 ? '70px' : '15px';
        };

        sr.reveal('.WelcomeDescArticle', {
            origin: 'bottom',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });
        sr.reveal('.WelcomeDescBalance', {
            origin: 'bottom',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });
        sr.reveal('.WelcomeServiceArticle', {
            origin: 'bottom',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });

        const intervalId = setInterval(() => {
            setCurrentPage((prevPage) => (prevPage < 2 ? prevPage + 1 : 1));
        }, 5000);
    
        // Limpar o intervalo quando o componente for desmontado
        return () => clearInterval(intervalId);
    }, [currentPage]);


    return (
        <main className={`welcomeMain page-${currentPage}`}>
            <div className="logoWelcomeTxt">
                <img src={logo} alt="logo" />
                <h1>RequestEase</h1>
            </div>

            <WelcomeIntro />
            {currentPage === 1 && <WelcomeDescri />}
            {currentPage === 2 && <WelcomeService />}
            <WelcomeTecno />

            {/* Navegação do carrossel */}
            {/* <div>
                <button onClick={prevPage}>Anterior</button>
                <button onClick={nextPage}>Próxima</button>
            </div> */}
        </main>
    )
}
export default welcome;