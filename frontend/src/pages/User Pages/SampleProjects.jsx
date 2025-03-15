import React from 'react'
import AllProjects from '../../components/Project Components/AllProjects'
import GuestProjects from '../../components/Project Components/GuestProjects'

const SampleProjects = () => {
  return (
    <div>
        <img className='rounded-lg' src="/project images/H3.png" alt="CiviModeler H1" />
        <div>
          <GuestProjects/>
        </div>
    </div>
  )
}

export default SampleProjects