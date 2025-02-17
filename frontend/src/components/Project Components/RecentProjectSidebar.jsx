import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../../context/AppContext.jsx';
import '../../../public/styles/RecentProjectSidebar.css';

const defaultImage3 = '/project images/T3.png';

const RecentProjectSidebar = () => {
  const [userProjects, setUserProjects] = useState([]);
  const { backendUrl, userData } = useContext(AppContext);

  useEffect(() => {
    if (userData && userData._id) {
      fetch(`${backendUrl}/api/project/get-user-projects/${userData._id}`, { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUserProjects(data.projects);
          } else {
            console.error('Error fetching user projects:', data.message);
          }
        })
        .catch((error) => console.error('Error fetching user projects:', error));
    }
  }, [userData, backendUrl]);

  return (
    <div className="recent-project-sidebar">
      {userProjects.length ? (
        <ul className="project-list">
          {userProjects.map((project) => (
            <li key={project._id} className="project-item">
              <img
                src={project.thumbnail || defaultImage3}
                alt={project.projectName}
                className="project-thumbnail"
              />
              <span className="project-name">{project.projectName}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className='text-sm'>No projects found.</p>
      )}
    </div>
  );
};

export default RecentProjectSidebar;