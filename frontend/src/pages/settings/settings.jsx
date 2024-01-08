import { useEffect } from 'react';
import ScrollReveal from 'scrollreveal';
import Navbar from "../components/Navbar";
import { Aside } from './components/asideSettings/Aside';
import { ProfileSettings } from './components/profileSettings/ProfileSettings';

const settings = () => {

    useEffect(() => {
        const sr = ScrollReveal();

        const calculateDistance = () => {
            return window.innerWidth > 768 ? '70px' : '0px';
        };
        sr.reveal('.headerLogoName', {
            origin: 'left',
            duration: 1000,
            distance: calculateDistance(),
            reset: true,
        });
    }, []);

    return (
        <main className="main-settings-content">
            <Navbar />
            <section className='section-settings-content'>
                <Aside />
                <ProfileSettings />
            </section>
        </main>
    )
}

export default settings;