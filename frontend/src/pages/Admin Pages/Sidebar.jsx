import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-800 text-white p-5 flex flex-col justify-between">
      <div>
        <h2 className="text-xl font-bold mb-4">Admin Dashboard</h2>
        <ul>
          <li className="mb-2">
            <Link to="/admin/dashboard" className="block p-2 hover:bg-gray-700 rounded">Dashboard</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/project-management" className="block p-2 hover:bg-gray-700 rounded">Project Management</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/user-management" className="block p-2 hover:bg-gray-700 rounded">User Management</Link>
          </li>
          <li className="mb-2">
            <Link to="/admin/reports" className="block p-2 hover:bg-gray-700 rounded">Reports</Link>
          </li>
        </ul>
      </div>
      <button className="bg-red-600 hover:bg-red-700 p-2 rounded text-center">
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
