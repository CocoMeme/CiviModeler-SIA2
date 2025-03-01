import React from "react";
import { Outlet, NavLink } from "react-router-dom";

const ProfileLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Profile Tabs */}
      <div className="bg-white shadow-md rounded-lg p-4">
        <div className="flex space-x-6 border-b pb-2">
          <NavLink
            to="/profile/overview"
            className={({ isActive }) =>
              `pb-2 px-4 ${isActive ? "border-b-4 border-purple-700 text-purple-700 font-semibold" : "text-gray-600 hover:text-purple-700"}`
            }
          >
            Overview
          </NavLink>
          <NavLink
            to="/profile/settings"
            className={({ isActive }) =>
              `pb-2 px-4 ${isActive ? "border-b-4 border-purple-700 text-purple-700 font-semibold" : "text-gray-600 hover:text-purple-700"}`
            }
          >
            Account Settings
          </NavLink>
          <NavLink
            to="/profile/security"
            className={({ isActive }) =>
              `pb-2 px-4 ${isActive ? "border-b-4 border-purple-700 text-purple-700 font-semibold" : "text-gray-600 hover:text-purple-700"}`
            }
          >
            Security
          </NavLink>
          <NavLink
            to="/profile/subscription"
            className={({ isActive }) =>
              `pb-2 px-4 ${isActive ? "border-b-4 border-purple-700 text-purple-700 font-semibold" : "text-gray-600 hover:text-purple-700"}`
            }
          >
            Subscription
          </NavLink>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-4 bg-white p-6 shadow-md rounded-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default ProfileLayout;
