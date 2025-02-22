import React, { useState } from 'react'
import RecentProject from '../../components/Project Components/RecentProject'
import ProjectDetailsModal from '../../components/Project Components/ProjectDetailsModal'

const UserProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null)

  const openModal = (project) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  return (
    <div>
      <img className='rounded-lg' src="/project images/H2.png" alt="CiviModeler H1" />
      <RecentProject onProjectClick={openModal} />
      {selectedProject && <ProjectDetailsModal project={selectedProject} onClose={closeModal} />}
    </div>
  )
}

export default UserProjects