import React from "react";
import '../welcomePage/components/style.css';
import computer from './assets/imgFront.png';
import seta from './assets/imgSeta.png';
import { Link } from 'react-router-dom';

const WelcomeIntro = () => {
    return (
        <section className="welcomeIntroSection">
            <article className="welcomeIntroArticle">
                <div className="welcomeTxt">
                    <span>Rest easy knowing your calls are in good hands.</span>
                    <div className="btnTxt">
                        <Link to={"/auth"}>
                            <button>Start</button>
                        </Link>
                    </div>
                </div>
                <img src={computer} alt="" />
            </article>
            <div className="animation">
                <a href="#hyper">
                    <div className="setaWelcomeIntro">
                        <img src={seta} alt="descer" />
                    </div>
                </a>
            </div>
        </section>
    );
};
export default WelcomeIntro;