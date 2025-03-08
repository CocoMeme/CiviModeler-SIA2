import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';

const LatestChanges = () => {
  const [updates, setUpdates] = useState([]);
  const { backendUrl, userData, loading } = useContext(AppContext);

  useEffect(() => {
    if (!loading && userData && userData._id) {
      // This would ideally fetch from an API endpoint that tracks user activity
      // For now we'll simulate with the most recently updated projects
      fetch(`${backendUrl}/api/project/get-user-projects/${userData._id}?sort=-updatedAt&limit=3`, { 
        credentials: 'include' 
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setUpdates(data.projects.slice(0, 3));
          }
        })
        .catch((error) => console.error('Error fetching updates:', error));
    }
  }, [userData, backendUrl, loading]);

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-bold mb-3">Latest Updates</h2>
      
      {loading ? (
        <div className="flex items-center justify-center h-20">
          <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : updates.length > 0 ? (
        <ul className="space-y-3">
          {updates.map((update) => (
            <li key={update._id} className="border-b border-gray-100 pb-2 last:border-0">
              <Link 
                to={`/user/project-detail/${update._id}`}
                className="block hover:bg-gray-50 rounded p-1 -mx-1"
              >
                <p className="text-sm font-medium text-gray-800 truncate">{update.projectName}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-500">
                    {new Date(update.updatedAt).toLocaleDateString()}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Updated
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 py-2">No recent activity</p>
      )}
    </div>
  );
};

export default LatestChanges;