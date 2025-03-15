import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import Card from './Card.jsx';
import { AppContext } from '../../context/AppContext.jsx';

const RecentProject = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { backendUrl, userData, loading } = useContext(AppContext);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const projectsPerPage = 12;
  const loader = useRef(null);

  // Fetch user's projects
  useEffect(() => {
    if (!loading && userData?._id) {
      fetch(`${backendUrl}/api/project/get-user-projects/${userData._id}`, { credentials: 'include' })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProjects(data.projects);
            setFilteredProjects(data.projects);
            setVisibleProjects(data.projects.slice(0, projectsPerPage));
          } else {
            console.error('Error fetching user projects:', data.message);
          }
        })
        .catch((error) => console.error('Error fetching user projects:', error));
    }
  }, [userData, backendUrl, loading]);

  // Apply search filter
  useEffect(() => {
    let result = [...projects];
    
    if (searchTerm) {
      result = result.filter(project => 
        project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.projectDescription?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort by newest first
    result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    
    setFilteredProjects(result);
    setVisibleProjects(result.slice(0, projectsPerPage));
    setPage(1);
  }, [searchTerm, projects]);

  // Handle intersection observer for infinite scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting && !isLoadingMore && filteredProjects.length > visibleProjects.length) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      const startIndex = (nextPage - 1) * projectsPerPage;
      const endIndex = startIndex + projectsPerPage;
      
      setTimeout(() => {
        const newProjects = filteredProjects.slice(0, endIndex);
        setVisibleProjects(newProjects);
        setPage(nextPage);
        setIsLoadingMore(false);
      }, 500);
    }
  }, [page, filteredProjects, isLoadingMore, projectsPerPage, visibleProjects.length]);

  // Setup intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1
    };

    const observer = new IntersectionObserver(handleObserver, options);
    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [handleObserver]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='py-5'>
      <div className='mb-6'>
        <div className='flex flex-col space-y-4'>
          <p className='font-semibold text-lg'>Your Projects</p>
          <div className='w-full max-w-md'>
            <input
              type="text"
              placeholder="Search your projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-4 py-2 border rounded-md'
            />
          </div>
        </div>
      </div>

      {visibleProjects.length > 0 ? (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {visibleProjects.map((project, index) => (
              <div key={project._id || index}>
                <Card project={project} />
              </div>
            ))}
          </div>
          
          {/* Loading indicator */}
          {filteredProjects.length > visibleProjects.length && (
            <div ref={loader} className="flex justify-center py-4">
              {isLoadingMore ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              ) : (
                <div className="h-8"></div>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-center py-8">
          {searchTerm ? "No projects match your search." : "You don't have any projects yet."}
        </p>
      )}
    </div>
  );
};

export default RecentProject;