import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-900">
        <Outlet /> {/* Renders Dashboard or Reports inside the layout */}
      </div>
    </div>
  );
};

export default AdminLayout;
