import React from 'react'
import RecentProject from '../../components/Project Components/RecentProject'
import AllProjects from '../../components/Project Components/AllProjects'


const UserHome = () => {
  return (
    <div>
      <img className='rounded-lg' src="/project images/H1.png" alt="CiviModeler H1" />
      <div>
        <RecentProject/>
        <AllProjects/>
      </div>
    </div>
  )
}

export default UserHome