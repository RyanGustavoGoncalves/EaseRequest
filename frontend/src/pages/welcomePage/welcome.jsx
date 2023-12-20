import React, { useEffect, useState } from "react";
import ScrollReveal from 'scrollreveal';
import './components/style.css';
import logo from './assets/icons8-telefone-40.png';
import WelcomeIntro from "../welcomeIntro/WelcomeIntro";
import WelcomeDescri from "../welcomeDescri/WelcomeDescri";
import WelcomeService from "../welcomeService/WelcomeService";
import WelcomeTecno from "../welcomeTecno/WelcomeTecno";

const welcome = () => {

    useEffect(() => {
        const sr = ScrollReveal();

        const calculateDistance = () => {
            // Lógica para calcular a distância com base em fatores responsivos
            return window.innerWidth > 768 ? '70px' : '0px';
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
        sr.reveal('.WelcomeServiceSection', {
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


    return (
        <main className="welcomeMain">
            <div className="logoWelcomeTxt">
                <img src={logo} alt="logo" />
                <h1>RequestEase</h1>
            </div>
            <WelcomeIntro />
            <WelcomeDescri />
            <WelcomeService />
            <WelcomeTecno />
        </main>
    )
}
export default welcome;