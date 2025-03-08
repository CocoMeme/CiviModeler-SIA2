import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../../../context/AppContext';
import { FaChartBar, FaCalendarAlt, FaTasks, FaChartPie, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectInsights = () => {
  const [insights, setInsights] = useState({
    totalProjects: 0,
    inProgressProjects: 0,
    recentActivity: 0,
    categories: {}
  });
  const [loading, setLoading] = useState(true);
  const { backendUrl, userData } = useContext(AppContext);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!userData || !userData._id) return;
      
      try {
        const response = await fetch(`${backendUrl}/api/project/get-user-projects/${userData._id}`, {
          credentials: 'include'
        });
        const data = await response.json();
        
        if (data.success && data.projects) {
          const projects = data.projects;
          
          // Calculate in-progress projects - check if sloyd.modelUrl doesn't exist or is null
          const inProgress = projects.filter(project => {
            if (!project.sloyd || !project.sloyd.modelUrl) {
              console.log('No model URL:', project.projectName);
              return true;
            }
            return false;
          }).length;
          
          // Count projects by category
          const categoryCount = projects.reduce((acc, project) => {
            const category = project.category || 'Other';
            acc[category] = (acc[category] || 0) + 1;
            return acc;
          }, {});
          
          // Count recent activity (projects updated in the last 30 days)
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          const recentCount = projects.filter(p => 
            new Date(p.updatedAt) > thirtyDaysAgo
          ).length;
          
          setInsights({
            totalProjects: projects.length,
            inProgressProjects: inProgress,
            recentActivity: recentCount,
            categories: categoryCount
          });
        }
      } catch (error) {
        console.error('Error fetching project insights:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchInsights();
  }, [userData, backendUrl]);

  // Simple function to get a dynamic color based on category name
  const getCategoryColor = (category) => {
    const colors = {
      'Residential': 'bg-blue-100 text-blue-800',
      'Commercial': 'bg-purple-100 text-purple-800',
      'Infrastructure': 'bg-green-100 text-green-800',
      'Industrial': 'bg-yellow-100 text-yellow-800',
      'Other': 'bg-gray-100 text-gray-800'
    };
    
    return colors[category] || colors['Other'];
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Project Insights</h2>
        <Link 
          to="/user/project-analytics" 
          className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
        >
          <span className="mr-1">Full Analytics</span> <FaExternalLinkAlt size={12} />
        </Link>
      </div>
      
      {loading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 flex flex-col">
              <div className="flex items-center mb-2">
                <FaChartBar className="text-blue-600 mr-2" />
                <span className="text-sm text-gray-600">Total Projects</span>
              </div>
              <span className="text-2xl font-bold text-blue-700">{insights.totalProjects}</span>
            </div>
            
            <div className="bg-amber-50 rounded-lg p-4 flex flex-col">
              <div className="flex items-center mb-2">
                <FaChartPie className="text-amber-600 mr-2" />
                <span className="text-sm text-gray-600">In Progress</span>
              </div>
              <span className="text-2xl font-bold text-amber-700">{insights.inProgressProjects}</span>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 flex flex-col">
              <div className="flex items-center mb-2">
                <FaCalendarAlt className="text-purple-600 mr-2" />
                <span className="text-sm text-gray-600">Recent Activity</span>
              </div>
              <span className="text-2xl font-bold text-purple-700">{insights.recentActivity}</span>
            </div>
          </div>
          
          {/* Project Categories */}
          {Object.keys(insights.categories).length > 0 && (
            <div className="border-t border-gray-100 pt-4">
              <h3 className="text-md font-medium mb-3">Projects by Category</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(insights.categories).map(([category, count]) => (
                  <div 
                    key={category} 
                    className={`${getCategoryColor(category)} px-3 py-1 rounded-full text-xs font-medium flex items-center`}
                  >
                    {category} <span className="ml-1 bg-white bg-opacity-30 px-1.5 rounded-full">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {insights.totalProjects === 0 && (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No project data available yet</p>
              <Link 
                to="/user/create-project" 
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Create Your First Project
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectInsights;