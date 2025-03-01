import React, { useState, useEffect } from "react";
import axios from "axios";

const ParentProfile = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [userData, setUserData] = useState(null); // Initially null to indicate loading

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/user/data`,
          { withCredentials: true }
        );

        if (response.data.success && response.data.user) {
          setUserData(response.data.user); // Ensure we use the correct property
        } else {
          console.error("Error fetching user data:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Handle loading state
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading user data...
      </div>
    );
  }

  return (
    <div className="parent-profile-container flex flex-col items-center justify-center pt-20 px-6 min-h-screen bg-gray-100">
      <div className="profile-content w-full max-w-4xl px-10 py-8 bg-white shadow-lg rounded-xl">
        <div className="text-center mb-8">
          <img
            src="/path-to-user-avatar.jpg"
            alt="User Avatar"
            className="w-32 h-32 rounded-full mx-auto border-4 border-purple-600 shadow-md"
          />
        </div>

        <div className="flex justify-center space-x-6 mb-6">
          {["overview"].map((section) => (
            <button
              key={section}
              className={`px-6 py-3 text-lg rounded-lg font-semibold transition ${
                activeSection === section
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setActiveSection(section)}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
            </button>
          ))}
        </div>

        <section className="text-center">
          {activeSection === "overview" && (
            <div>
              <h2 className="text-xl font-semibold text-purple-700">Profile Overview</h2>
              <p className="text-lg text-gray-600 mt-2">Name: {userData?.name || "N/A"}</p>
              <p className="text-lg text-gray-600">Email: {userData?.email || "N/A"}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ParentProfile;
