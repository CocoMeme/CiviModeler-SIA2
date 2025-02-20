import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalCost: 0,
  });
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/project/dashboard-data`, { withCredentials: true });
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };
    
    const fetchRecentProjects = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/project/recent-projects`, { withCredentials: true });
        setRecentProjects(data);
      } catch (error) {
        console.error('Error fetching recent projects:', error);
      }
    };
    fetchDashboardData();
    fetchRecentProjects();
  }, []);

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">Admin Dashboard</h1>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Total Cost</h2>
            <p className="text-xl mt-2">₱{dashboardData.totalCost.toLocaleString()}</p>
          </div>
          <div className="bg-green-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Users</h2>
            <p className="text-xl mt-2">{dashboardData.totalUsers}</p>
          </div>
          <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Total layouts</h2>
            <p className="text-xl mt-2">{dashboardData.totalProjects}</p>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-white">
          <h2 className="text-xl font-bold mb-4">Most Recent Projects</h2>
          <table className="min-w-full bg-gray-800 border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Project Name</th>
                <th className="py-2 px-4 border-b text-left">Prospect Contractor</th>
                <th className="py-2 px-4 border-b text-left">Budget</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.map((project) => (
                <tr key={project.id}>
                  <td className="py-2 px-4 border-b">{project.projectName}</td>
                  <td className="py-2 px-4 border-b">{project.contractor}</td>
                  <td className="py-2 px-4 border-b">₱{project.budget.toLocaleString()}</td>
                  <td className="py-2 px-4 border-b">
                    <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mr-2">Update</button>
                    <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;