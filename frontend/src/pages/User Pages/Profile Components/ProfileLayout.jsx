import React, { useEffect } from "react";
import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";

const ProfileLayout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Redirect to overview if on base profile route
    useEffect(() => {
        if (location.pathname === "/profile") {
            navigate("/profile/overview");
        }
    }, [location.pathname, navigate]);

    return (
        <div className=" bg-gray-100 pt-4">
            <div className="min-h-screen bg-gray-100 mt-20 max-w-screen-xl m-auto p-6">
                {/* Profile Tabs */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex space-x-6">
                        <NavLink
                            to="/profile/overview"
                            className={({ isActive }) =>
                                `pb-2 px-4 ${isActive ? "border-b-4 border-purple-700 text-purple-700 font-semibold" : "text-gray-600 hover:text-purple-700"}`
                            }
                        >
                            Overview
                        </NavLink>
                        <NavLink
                            to="/profile/security"
                            className={({ isActive }) =>
                                `pb-2 px-4 ${isActive ? "border-b-4 border-purple-700 text-purple-700 font-semibold" : "text-gray-600 hover:text-purple-700"}`
                            }
                        >
                            Security
                        </NavLink>
                    </div>
                </div>

                {/* Main Content */}
                <div className="mt-4 bg-white p-10 shadow-md rounded-lg">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default ProfileLayout;
