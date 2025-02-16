import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalProjects: 0,
    totalCost: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/project/dashboard-data`, { withCredentials: true });
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
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
          <h2 className="text-xl font-bold mb-4">Top Paying Clients</h2>
          <table className="min-w-full bg-gray-800 border-collapse">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Id</th>
                <th className="py-2 px-4 border-b text-left">Assigned</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Priority</th>
                <th className="py-2 px-4 border-b text-left">Budget</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-4 border-b">1</td>
                <td className="py-2 px-4 border-b">Sunil Joshi<br />Web Designer</td>
                <td className="py-2 px-4 border-b">Elite Admin</td>
                <td className="py-2 px-4 border-b">Low</td>
                <td className="py-2 px-4 border-b">$3.9</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mr-7">Update</button>
                  <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">2</td>
                <td className="py-2 px-4 border-b">Andrew McDownland<br />Project Manager</td>
                <td className="py-2 px-4 border-b">Real Homes WP Theme</td>
                <td className="py-2 px-4 border-b">Medium</td>
                <td className="py-2 px-4 border-b">$24.5k</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mr-7">Update</button>
                  <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">3</td>
                <td className="py-2 px-4 border-b">Christopher Jamil<br />Project Manager</td>
                <td className="py-2 px-4 border-b">MedicalPro WP Theme</td>
                <td className="py-2 px-4 border-b">High</td>
                <td className="py-2 px-4 border-b">$12.8k</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mr-7">Update</button>
                  <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">4</td>
                <td className="py-2 px-4 border-b">Nirav Joshi<br />Frontend Engineer</td>
                <td className="py-2 px-4 border-b">Hosting Press HTML</td>
                <td className="py-2 px-4 border-b">Critical</td>
                <td className="py-2 px-4 border-b">$2.4k</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mr-7">Update</button>
                  <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
              <tr>
                <td className="py-2 px-4 border-b">5</td>
                <td className="py-2 px-4 border-b">Tim George<br />Web Designer</td>
                <td className="py-2 px-4 border-b">Hosting Press HTML</td>
                <td className="py-2 px-4 border-b">Critical</td>
                <td className="py-2 px-4 border-b">$5.4k</td>
                <td className="py-2 px-4 border-b">
                  <button className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 mr-7">Update</button>
                  <button className="bg-red-500 text-white py-1 px-4 rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;