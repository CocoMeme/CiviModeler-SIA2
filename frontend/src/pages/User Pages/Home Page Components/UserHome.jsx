import React from 'react'
import RecentProject from '../../../components/Project Components/RecentProject'
import RecentDesign from './RecentDesign'
import CreateDesign from './CreateDesign'
import ProjectInsights from './ProjectInsights'
import LatestChanges from './LatestChanges'
import CheckoutMore from './CheckoutMore'
import NewestContractors from './NewestContractors'

const UserHome = () => {
  return (
    <div className="flex flex-col space-y-6">
      {/* Hero Banner */}
      <img className='w-full rounded-lg' src="/project images/H1.png" alt="CiviModeler H1" />
      
      {/* Main Content Layout */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Side - Main Content (4/5 width) */}
        <div className="w-full md:w-4/5 space-y-6">
          <RecentDesign />
          <ProjectInsights />
          {/* <CreateDesign /> */}
        </div>
        
        {/* Right Side - Sidebar (1/5 width) */}
        <div className="w-full md:w-1/5 space-y-6">
          <LatestChanges />
          <NewestContractors />
          {/* <CheckoutMore /> */}
        </div>
      </div>
      
      {/* Recent Projects Carousel */}
      <div className="mt-8">
        {/* <RecentProject /> */}
      </div>
    </div>
  )
}

export default UserHome