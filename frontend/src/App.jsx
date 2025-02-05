import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AboutUs from './pages/AboutUs'
import ProjectDetail from './pages/User Pages/ProjectDetail'

const App = () => {
  return (
    <div >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login  />} />
        <Route path="/register" element={<Register  />} />
        <Route path="/about-us" element={<AboutUs  />} />
        <Route path="/project-detail" element={<ProjectDetail  />} />
      </Routes>
      <Footer/>
    </div>
  )
}

export default App