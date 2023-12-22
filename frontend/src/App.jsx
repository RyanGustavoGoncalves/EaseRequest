import { useState } from 'react'
import './App.css'
import Navbar from './pages/components/Navbar'
import Home from './pages/home/Home'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
        <Navbar />
        <Home />
      </main>
    </>
  )
}

export default App
