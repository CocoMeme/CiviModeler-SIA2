import React, { useState, useEffect, useContext, useCallback, useRef } from 'react';
import Card from './Card.jsx';
import { AppContext } from '../../context/AppContext.jsx';
import GuestProjectPreview from '../../pages/Guest Pages/GuestProjectPreview.jsx';

const GuestProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [visibleProjects, setVisibleProjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    contractor: 'all',
    sortBy: 'newest'
  });
  const [contractors, setContractors] = useState([]);
  const { backendUrl } = useContext(AppContext);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const projectsPerPage = 10;
  const loader = useRef(null);

  useEffect(() => {
    // Fetch projects
    fetch(`${backendUrl}/api/project/get-all-projects`, { credentials: 'include' })
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
        setFilteredProjects(data);
      })
      .catch((error) => {
        console.error('Error fetching projects:', error);
        setProjects([]);
        setFilteredProjects([]);
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

  // Apply filters and search
  useEffect(() => {
    let result = [...projects];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(project => 
        project.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.projectDescription && project.projectDescription.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.author && project.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (project.contractor && project.contractor.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply category filter
    if (filters.category !== 'all') {
      result = result.filter(project => project.category === filters.category);
    }
    
    // Apply contractor filter
    if (filters.contractor !== 'all') {
      const selectedContractor = contractors.find(c => c.name === filters.contractor);
      if (selectedContractor) {
        result = result.filter(project => project.contractorId === selectedContractor._id);
      }
    }
    
    // Apply sorting
    if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    } else if (filters.sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    } else if (filters.sortBy === 'alphabetical') {
      result.sort((a, b) => (a.projectName || '').localeCompare(b.projectName || ''));
    }
    
    setFilteredProjects(result);
    // Load initial projects
    setVisibleProjects(result.slice(0, projectsPerPage));
    setPage(1);
  }, [searchTerm, filters, projects, contractors]);

  // Handle intersection observer
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsPreviewModalOpen(true);
  };

  // Extract unique categories from projects
  const categories = ['all', ...new Set(projects.filter(p => p.category).map(p => p.category))];
  
  // Extract unique contractors and ensure we have valid data
  const contractorOptions = ['all', ...new Set(contractors
    .filter(c => c && c._id && c.name)
    .map(c => c.name))];

  return (
    <div className='py-5'>
      {/* Page Header */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-5'>
          <p className='font-semibold text-lg'>All Designs</p>
        </div>
      </div>

      {/* Main Content Section with Left Filter */}
      <div className='flex flex-col md:flex-row'>
        {/* Filter Sidebar - Left Side */}
        <div className='w-full md:w-1/4 mb-6 md:mb-0 md:pr-6 md:border-r'>
          <div className='filter-sidebar sticky top-4'>
            <h3 className='font-semibold text-lg mb-4'>Search & Filters</h3>
            
            {/* Search Bar moved to top of sidebar */}
            <div className='mb-6'>
              <input
                type="text"
                placeholder="Search designs..."
                value={searchTerm}
                onChange={handleSearchChange}
                className='w-full px-4 py-2 border rounded-md'
              />
            </div>
            
            <div className='mb-6'>
              <h4 className='font-medium mb-2'>Category</h4>
              <select 
                value={filters.category} 
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className='w-full p-2 border rounded-md bg-white'
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : 
                      (category.charAt(0).toUpperCase() + category.slice(1))}
                  </option>
                ))}
              </select>
            </div>
            
            <div className='mb-6'>
              <h4 className='font-medium mb-2'>Contractor</h4>
              <select 
                value={filters.contractor} 
                onChange={(e) => handleFilterChange('contractor', e.target.value)}
                className='w-full p-2 border rounded-md bg-white'
              >
                {contractorOptions.map(contractor => (
                  <option key={contractor} value={contractor}>
                    {contractor === 'all' ? 'All Contractors' : contractor}
                  </option>
                ))}
              </select>
            </div>
            
            <div className='mb-6'>
              <h4 className='font-medium mb-2'>Sort By</h4>
              <select 
                value={filters.sortBy} 
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className='w-full p-2 border rounded-md bg-white'
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
            
            <button 
              onClick={() => {
                setSearchTerm('');
                setFilters({category: 'all', contractor: 'all', sortBy: 'newest'});
              }}
              className='w-full py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors'
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Project Cards - Right Side */}
        <div className='w-full md:w-3/4 md:pl-6'>
          {visibleProjects.length ? (
            <>
              <div className='flex flex-wrap gap-4 justify-start'>
                {visibleProjects.map((project, index) => (
                  <div key={project._id || index} className='w-full md:w-[calc(50%-0.5rem)] mb-4'>
                    <Card 
                      project={project} 
                      contractors={contractors} 
                      onClick={handleProjectClick}
                    />
                  </div>
                ))}
              </div>
              {/* Loading indicator */}
              {filteredProjects.length > visibleProjects.length && (
                <div ref={loader} className="flex justify-center py-4">
                  {isLoadingMore ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  ) : (
                    <div className="h-8"></div> // Placeholder to maintain layout
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-center py-8">No designs match your criteria.</p>
          )}
        </div>

        {/* Preview Modal */}
        {isPreviewModalOpen && selectedProject && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black opacity-50" onClick={() => setIsPreviewModalOpen(false)}></div>
            <div className="absolute inset-4 z-10 overflow-hidden rounded-lg">
              <GuestProjectPreview 
                project={selectedProject}
                onClose={() => setIsPreviewModalOpen(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GuestProjects;
