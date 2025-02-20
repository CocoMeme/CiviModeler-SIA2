import React, { useState } from "react";

const ParentProfile = () => {
  const [activeSection, setActiveSection] = useState("overview");

  return (
    <div className="parent-profile-container flex flex-col items-center justify-center pt-20 px-6 min-h-screen bg-gray-100">
      <div className="profile-content w-full max-w-4xl px-10 py-8 bg-white shadow-lg rounded-xl">
        {/* User Info Section */}
        <div className="text-center mb-8">
          {/* User Avatar */}
          <img
            src="/path-to-user-avatar.jpg"
            alt="User Avatar"
            className="w-32 h-32 rounded-full mx-auto border-4 border-purple-600 shadow-md"
          />
          <h2 className="text-2xl font-bold mt-4 text-purple-700">John Doe</h2>
          <p className="text-lg text-gray-500">johndoe@example.com</p>
        </div>

        {/* Navigation */}
        <div className="flex justify-center space-x-6 mb-6">
          {["overview", "contact", "verify"].map((section) => (
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

        {/* Sections */}
        <section className="text-center">
          {activeSection === "overview" && (
            <div>
              <h2 className="text-xl font-semibold text-purple-700">Profile Overview</h2>
              <p className="text-lg text-gray-600 mt-2">Basic details about your profile.</p>
            </div>
          )}

          {activeSection === "contact" && (
            <div>
              <h2 className="text-xl font-semibold text-purple-700">Contact Details</h2>
              <p className="text-lg text-gray-600 mt-2">Phone: (123) 456-7890</p>
              <p className="text-lg text-gray-600">Address: 123 Main St, Cityville</p>
            </div>
          )}

          {activeSection === "verify" && (
            <div>
              <h2 className="text-xl font-semibold text-purple-700">Verify Account</h2>
              <p className="text-lg text-gray-600 mt-2">Click below to verify your account.</p>
              <button className="mt-6 px-6 py-3 text-lg bg-green-600 text-white rounded-lg shadow-md transition hover:bg-green-700">
                Verify Now
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default ParentProfile;
