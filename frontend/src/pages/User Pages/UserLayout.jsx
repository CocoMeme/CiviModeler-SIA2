import UserSidebar from "./UserSidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar taking 1/6 of the screen width */}
      <div className="w-1/6 min-h-screen">
        <UserSidebar />
      </div>

      {/* Main content taking 5/6 of the screen width */}
      <div className="w-5/6 p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
