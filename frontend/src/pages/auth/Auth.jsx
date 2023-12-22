import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import ScrollReveal from 'scrollreveal';
import Register from "./register/Register";
import Login from "./login/Login";
import wave from './assets/wave (2).svg';
import './components/style.css';
import logo from '../welcomePage/assets/iconList.png';

const Auth = ({ login }) => {
  const [isLoginVisible, setLoginVisible] = useState(false);
  const [transitionClass, setTransitionClass] = useState('');

  const toggleForm = () => {
    setTransitionClass('fade-out');
    setTimeout(() => {
      setLoginVisible(!isLoginVisible);
      setTransitionClass('fade-in');
    }, 200);
  };

  useEffect(() => {
    setTransitionClass('fade-in');
  }, []);

  useEffect(() => {
    const sr = ScrollReveal();

    const calculateDistance = () => {
      return window.innerWidth > 768 ? '70px' : '0px';
    };

    sr.reveal('.authFieldset', {
      origin: 'top',
      duration: 2000,
      distance: calculateDistance(),
      reset: true,
    });

    sr.reveal('.logo', {
      origin: 'left',
      duration: 2000,
      distance: calculateDistance(),
      reset: true,
    });
  }, []);

  return (
    <main className={`authMain ${transitionClass}`}>
      <div className="logo"><Link to={"/"}><img src={logo} alt="logo" /></Link></div>
      {isLoginVisible ? <Login toggleForm={toggleForm} login={login} /> : <Register toggleForm={toggleForm} />}
      <div className="WelcomeDescWave">
        <img src={wave} alt="" />
      </div>
    </main>
  );
};

export default Auth;
