import React from 'react'
import GuestProjects from '../../components/Project Components/GuestProjects'

const Projects = () => {
  return (
    <>    
    <div className='min-h-screen pt-20'>
        <div className='container mx-auto px-4 py-8 min-h-screen'>
            <h1 className="text-3xl font-bold text-center mb-4">Projects</h1>
            <p className="text-center mb-8">Here are some of the projects we've worked on.</p>
            <GuestProjects/>
        </div>
        

    </div>
    </>

  )
}

export default Projects