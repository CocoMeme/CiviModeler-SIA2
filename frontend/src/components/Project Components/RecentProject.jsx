import React, { useState, useEffect, useContext } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Card from './Card.jsx';
import { AppContext } from '../../context/AppContext.jsx';

const RecentProject = () => {
  const [projects, setProjects] = useState([]);
  const { backendUrl, userData, loading } = useContext(AppContext); // Add loading state

  useEffect(() => {
    if (!loading) { // Wait for loading to be false
      if (userData && userData._id) {
        fetch(`${backendUrl}/api/project/get-user-projects/${userData._id}`, { credentials: 'include' })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setProjects(data.projects);
            } else {
              console.error('Error fetching user projects:', data.message);
            }
          })
          .catch((error) => console.error('Error fetching user projects:', error));
      } else {
        console.error("User ID not found in userData:", userData);
      }
    }
  }, [userData, backendUrl, loading]); // Add loading to dependency array

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 4 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  if (loading) {
    return <p>Loading...</p>; // Show loading state
  }

  return (
    <div className='py-5'>
      <div>
        <p className='font-semibold text-lg mb-5'>Recent Designs</p>
      </div>
      {projects.length ? (
        <Carousel
          responsive={responsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          rewind={true} // Ensures smooth looping
          showDots={true}
          arrows={true}
        >
          {projects.map((project, index) => (
            <div key={project._id || project.projectName || index}>
              <Card project={project} />
            </div>
          ))}
        </Carousel>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default RecentProject;