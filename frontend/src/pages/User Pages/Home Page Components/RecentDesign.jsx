import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';

// Use the standard No Image file as default
const defaultImage = '/project images/No Image.png';

const RecentDesign = () => {
  const [recentProjects, setRecentProjects] = useState([]);
  const { backendUrl, userData, loading } = useContext(AppContext);

  useEffect(() => {
    if (!loading && userData && userData._id) {
      fetch(`${backendUrl}/api/project/get-user-projects/${userData._id}?limit=3`, { 
        credentials: 'include' 
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setRecentProjects(data.projects.slice(0, 3));
          } else {
            console.error('Error fetching recent designs:', data.message);
          }
        })
        .catch((error) => console.error('Error fetching recent designs:', error));
    }
  }, [userData, backendUrl, loading]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Recent Designs</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : recentProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentProjects.map((project) => (
            <Link 
              to={`/user/project-detail/${project._id}`} 
              key={project._id} 
              className="block hover:scale-105 transition-transform duration-200"
            >
              <div className="bg-gray-100 rounded-md overflow-hidden shadow-sm">
                <img 
                  src={project.thumbnail || defaultImage} 
                  alt={project.projectName}
                  className="w-36 m-auto h-full object-cover "
                  onError={(e) => { e.target.onerror = null; e.target.src = defaultImage; }}
                />
                <div className="p-3 bg-slate-50">
                  <h3 className="font-medium text-gray-900 truncate">{project.projectName}</h3>
                  <p className="text-sm text-gray-500">
                    Last edited: {new Date(project.updatedAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-md p-6 text-center">
          <p className="text-gray-600 mb-3">You haven't created any designs yet</p>
          <Link 
            to="/user/create-project" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Create Your First Design
          </Link>
        </div>
      )}
      
      {recentProjects.length > 0 && (
        <div className="mt-4 text-right">
          <Link 
            to="/user/user-projects" 
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All My Designs →
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentDesign;