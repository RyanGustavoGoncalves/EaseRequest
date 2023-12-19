import React from "react";
import './components/style.css';
import computer from './assets/cg.png';
import logo from './assets/40.png';

const welcome = () => {
    return (
        <main className="welcomeMain">
            <div className="logoWelcomeTxt">
                <img src={logo} alt="logo" />
                <h1>maintenance administration</h1>
            </div>
            <section className="welcomeSection">
                <div className="welcomeTxt">
                    <span>Fique tranquilo sabendo que sua declaração está em boas mãos.</span>
                </div>
                <img src={computer} alt="" />
            </section>
        </main>
    )
}
export default welcome;