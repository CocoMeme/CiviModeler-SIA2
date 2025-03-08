import React from 'react'
import { Outlet } from 'react-router-dom'
import ProjectSidebar from './ProjectSidebar'

const ProjectLayout = () => {
  return (
    <div className="flex min-h-screen">
      <ProjectSidebar />
      <Outlet />
  </div>
  )
}

export default ProjectLayout