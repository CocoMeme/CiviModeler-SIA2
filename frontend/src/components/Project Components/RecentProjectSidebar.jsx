import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext.jsx';
import { FiRefreshCw } from 'react-icons/fi';
import '../../../public/styles/RecentProjectSidebar.css';

// Use the No Image file as default
const defaultImage = '/project images/No Image.png';

const RecentProjectSidebar = () => {
  const [userProjects, setUserProjects] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { backendUrl, userData } = useContext(AppContext);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    if (userData && userData._id) {
      try {
        const res = await fetch(`${backendUrl}/api/project/get-user-projects/${userData._id}`, { credentials: 'include' });
        const data = await res.json();
        if (data.success) {
          // Sort projects by createdAt date in descending order (newest first)
          const sortedProjects = data.projects.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          setUserProjects(sortedProjects);
        } else {
          console.error('Error fetching user projects:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user projects:', error);
      }
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [userData, backendUrl]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchProjects();
    setIsRefreshing(false);
  };

  const handleProjectClick = (project) => {
    navigate('/user/project-overview', { state: project });
    window.location.reload();
  };

  return (
    <div>
      <div className="mt-4 mb-2 p-2 text-sm flex items-center justify-between">
        <span>Recent Projects</span>
        <button 
          onClick={handleRefresh}
          className="p-1 hover:text-purple-500 transition-colors"
          disabled={isRefreshing}
        >
          <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="recent-project-sidebar">
        {userProjects.length ? (
          <>
            <ul className="project-list">
              {userProjects.slice(0, 5).map((project) => (
                <li key={project._id} className="project-item" onClick={() => handleProjectClick(project)}>
                  <img
                    src={project.thumbnail || defaultImage}
                    alt={project.projectName}
                    className="project-thumbnail"
                    onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
                  />
                  <span className="project-name">{project.projectName}</span>
                </li>
              ))}
            </ul>
            {userProjects.length > 5 && (
              <div className="my-2 text-center">
                <button
                  onClick={() => navigate('/user/user-projects')}
                  className="text-sm text-purple-600 hover:text-purple-800 transition-colors font-medium"
                >
                  See All Projects ({userProjects.length})
                </button>
              </div>
            )}
          </>
        ) : (
          <p className='text-sm'>No projects found.</p>
        )}
      </div>
    </div>
  );
};

export default RecentProjectSidebar;