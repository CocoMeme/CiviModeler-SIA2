import React from 'react'
import Banner from '../../components/Pages Components/Banner'
import Partnership from '../../components/Pages Components/Partnership'
import Testimony from '../Guest Pages/Testimony'
import AboutUs from '../Guest Pages/AboutUs'
import GuestProjects from '../../components/Project Components/GuestProjects'

const Home = () => {
  return (
    <div>
      <Banner />
      <Partnership />
      <Testimony />
      <AboutUs />
    </div>
  )
}

export default Home