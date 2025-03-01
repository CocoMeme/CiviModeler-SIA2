import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { backendUrl, setUserData, setIsLoggedin } = useContext(AppContext);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      if (data.success) {
        setUserData(null);
        setIsLoggedin(false);
        navigate('/');
        toast.success("Logged out successfully");
      } else {
        toast.error("Logout failed");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred during logout';
      toast.error(errorMsg);
    }
  };

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
      <button onClick={logout} className="bg-red-600 hover:bg-red-700 p-2 rounded text-center">
        Logout
      </button>
    </div>
  );
};

export default AdminSidebar;