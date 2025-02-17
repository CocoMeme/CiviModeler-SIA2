import React from 'react'
import RecentProject from '../../components/Project Components/RecentProject'


const UserHome = () => {
  return (
    <div>
      <img className='rounded-lg' src="/project images/H1.png" alt="CiviModeler H1" />
      <div>
        <RecentProject/>
      </div>
    </div>
  )
}

export default UserHome