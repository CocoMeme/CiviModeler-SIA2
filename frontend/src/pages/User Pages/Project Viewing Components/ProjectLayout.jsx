import React from 'react'
import { Outlet } from 'react-router-dom'
import ProjectSidebar from './ProjectSidebar'

const ProjectLayout = () => {
  return (
    <div className="flex min-h-screen">
    {/* Sidebar taking 1/6 of the screen width */}
    <div className="w-2/6 min-h-screen">
      <ProjectSidebar />
    </div>

    {/* Main content taking 5/6 of the screen width */}
    <div className="w-4/6 p-6">
      <Outlet />
    </div>
  </div>
  )
}

export default ProjectLayout