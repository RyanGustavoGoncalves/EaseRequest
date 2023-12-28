import { useState, useEffect } from 'react'
import ScrollReveal from 'scrollreveal';
import './App.css'
import Navbar from './pages/components/Navbar'
import Home from './pages/home/Home'
function App() {

  useEffect(() => {
    const sr = ScrollReveal();

    const calculateDistance = () => {
      // Lógica para calcular a distância com base em fatores responsivos
      return window.innerWidth > 768 ? '70px' : '0px';
    };

    sr.reveal('.homeDescript', {
      origin: 'top',
      duration: 1000,
      distance: calculateDistance(),
      reset: true,
    });
    sr.reveal('.headerLogoName', {
      origin: 'left',
      duration: 1000,
      distance: calculateDistance(),
      reset: true,
    });
    sr.reveal('.responsiveMenu', {
      origin: 'right',
      duration: 1000,
      distance: calculateDistance(),
      reset: true,
    });
  }, []);


  return (
    <>
      <main className='appMain'>
        <Navbar />
        <Home />
      </main>
    </>
  )
}

export default App
