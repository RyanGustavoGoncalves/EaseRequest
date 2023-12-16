import React from "react";
import imgMaintence from './assets/Analysis-amico.png';
import wave from './assets/wave.svg'
import './components/style.css';
const Home = () =>{
    return(
        <section className="homeSection">
            <img src={wave} alt="" />
            <div className="homeDescript">
                <div className="homeText">
                    <h2>Nosso projeto</h2>
                    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Modi, sit qui excepturi odio quam aspernatur exercitationem corporis quibusdam maxime voluptatum dolor autem assumenda itaque iste nulla voluptates, dolores non tenetur.</p>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores sunt aliquid, soluta suscipit laborum, facilis omnis explicabo natus, molestias saepe deleniti impedit excepturi veritatis ea quaerat similique illum atque perspiciatis!</p>
                </div>
                <img src={imgMaintence} alt="" width={500}/>
            </div>
        </section>
    )
}

export default Home;