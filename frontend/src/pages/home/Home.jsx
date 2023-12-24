import React from "react";
import wave from './assets/wave(1).svg'
import './components/style.css';
import mais from './assets/mais.png'
import { Link } from "react-router-dom";
const Home = () => {
    return (
        <section className="homeSection">
            <img src={wave} alt="" />
            <div className="homeDescript">

                <div className="subNav">
                    <div className="searchRequest">
                        <h2>Overview</h2>
                        <input type="text" placeholder="Search.." />
                    </div>
                    <div className="more">
                        <img src={mais} alt="more" />
                    </div>
                </div>

                <div className="boxTools">
                    <Link>
                        <div className="tool">
                            <h2>Name Collection</h2>
                        </div>
                    </Link>
                </div>
            </div>
        </section>
    )
}

export default Home;