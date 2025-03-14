import React, { useState, useEffect, useContext } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import Card from './Card.jsx';
import { AppContext } from '../../context/AppContext.jsx';

const AllProjects = () => {
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    // Fetch projects
    fetch(`${backendUrl}/api/project/get-all-projects`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => setProjects(data))
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setProjects([]);
      });

    // Update to use get-contractors endpoint
    fetch(`${backendUrl}/api/contractor/get-contractors`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.contractors)) {
          setContractors(data.contractors);
        } else {
          console.error('Invalid contractor data format');
          setContractors([]);
        }
      })
      .catch((error) => {
        console.error('Error fetching contractors:', error);
        setContractors([]);
      });
  }, [backendUrl]);

  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 4 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 3 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 1 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
  };

  return (
    <div className='py-5'>
      <div>
        <p className='font-semibold text-lg mb-5'>More Designs</p>
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
              <Card project={project} contractors={contractors} />
            </div>
          ))}
        </Carousel>
      ) : (
        <p>No projects available.</p>
      )}
    </div>
  );
};

export default AllProjects;
