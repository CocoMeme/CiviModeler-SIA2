import UserSidebar from "./UserSidebar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <div className="flex-1 p-6 w-5/6">
        <Outlet />
      </div>
    </div>
  );
};

export default UserLayout;
