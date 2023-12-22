import { useEffect, useState } from "react";
import './style/Splash.css';
import logo from '../welcomePage/assets/iconList.png';

const SplashScreen = () => {
    const [showSplash, setShowSplash] = useState(true);
    const [splashDisplay, setSplashDisplay] = useState({ display: 'grid' });

    // useEffect(() => {
    //     setTimeout(() => {
    //         setShowSplash(false);
    //         setTimeout(() => {
    //             setSplashDisplay({ display: 'none' });
    //         }, 500); // Tempo para a animação de fade-out
    //     }, 500); // Tempo para exibir o splash
    // }, []);

    const splashClasses = showSplash ? 'SplashScreen fade-in' : 'SplashScreen fade-out';

    return (
        <div className={splashClasses} style={{ display: splashDisplay.display }}>
            <article>
                <div className="titleSplash">
                    <h1>RequestEase</h1>
                    <img src={logo} alt="Clover" />
                </div>
            </article>
        </div>
    );
}

export default SplashScreen;
