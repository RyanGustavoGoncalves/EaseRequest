import wave from './assets/wave (2).svg'
import Icon from "./Icon";
import perfil from './assets/perfil.png';
import { useState } from 'react';
import Modal from '../components/Modal';
import { Link } from 'react-router-dom';

const WelcomeTecno = () => {

    const [modalIsOpen, setModalIsOpen] = useState(false);

    const openModal = () => {
        document.body.style.overflow = "hidden";
        setModalIsOpen(true);
    };

    const closeModal = () => {
        document.body.style.overflow = "auto";
        setModalIsOpen(false);
    };

    return (
        <section className="WelcomeServiceSection">
            <div className="tittleService">
                <h2>technologies and creator</h2>
            </div>

            <article className="WelcomeTecnoArticle">
                <div className="perfilGitHub">
                    <h2>GitHub</h2>
                    <Link to="https://github.com/RyanGustavoGoncalves" target='_blank'>
                        <Icon src={perfil} alt="perfil" />
                    </Link>
                </div>
            </article>

            <article className="WelcomeTecnoArticle">
                <div className="tecnoImg">
                    <Icon src="https://skillicons.dev/icons?i=spring&theme=light" alt="spring" />
                    <Icon src="https://skillicons.dev/icons?i=react&theme=light" alt="react" />
                    <Icon src="https://skillicons.dev/icons?i=vite&theme=light" alt="vite" />
                    <Icon src="https://skillicons.dev/icons?i=mongo&theme=light" alt="mongo" />
                </div>
            </article>

            {/* <Modal isOpen={modalIsOpen} onClose={closeModal}>
                <Link to="https://github.com/RyanGustavoGoncalves">
                    <Icon src={perfil} alt="perfil" />
                </Link>
            </Modal> */}


            <div className="WelcomeDescWave">
                <img src={wave} alt="" />
            </div>
        </section>
    );
};

export default WelcomeTecno;