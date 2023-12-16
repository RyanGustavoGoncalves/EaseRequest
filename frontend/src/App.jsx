import { useState } from 'react'
import './App.css'
import { Outlet } from 'react-router-dom'
import Navbar from './pages/components/Navbar'
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <main>
      <Navbar />
      <Outlet/>
      </main>
    </>
  )
}

export default App
