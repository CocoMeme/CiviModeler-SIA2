import React, { useState, useEffect, useContext } from 'react';
import Card from './Card.jsx';
import { AppContext } from '../../context/AppContext.jsx';

const GuestProjects = () => {
  const [projects, setProjects] = useState([]);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    fetch(`${backendUrl}/api/project/get-all-projects`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => console.error('Error fetching projects:', error));
  }, [backendUrl]);

  return (
    <div className='py-5'>
      <div>
        <p className='font-semibold text-lg mb-5'>All Designs</p>
      </div>
      {projects.length ? (
        <div className='flex flex-wrap gap-4 justify-center'>
          {projects.map((project, index) => (
            <div key={project._id || index} className='w-full sm:w-1/2 md:w-1/3 lg:w-1/4'>
              <Card project={project} />
            </div>
          ))}
        </div>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default GuestProjects;
