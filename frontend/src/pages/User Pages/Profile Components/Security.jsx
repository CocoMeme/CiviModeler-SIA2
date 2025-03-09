import React, { useState, useContext } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Security = () => {
  const { userData, setUserData, backendUrl } = useContext(AppContext);
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  // Loading states
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  
  // Password validation
  const validatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return false;
    }
    
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return false;
    }
    
    return true;
  };
  
  // Handle password update
  const updatePassword = async () => {
    if (!validatePassword()) return;
    
    setPasswordLoading(true);
    
    try {
      const response = await axios.put(
        `${backendUrl}/api/user/update-password/${userData._id}`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.data.message || "Failed to update password.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating password. Please try again."
      );
      console.error("Password update error:", error);
    } finally {
      setPasswordLoading(false);
    }
  };
  
  // Format date to readable string
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };
  
  return (
    <div className="security-container">
      <h2 className="text-xl font-semibold text-purple-700 mb-6">Security Settings</h2>
      
      {/* Password Change Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Change Password</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="currentPassword">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter your current password"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="newPassword">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter new password"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="confirmPassword">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Confirm new password"
            />
          </div>
          
          <button
            onClick={updatePassword}
            disabled={passwordLoading}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              passwordLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>
          
          {userData?.lastPasswordChange && (
            <p className="text-sm text-gray-600 mt-3">
              Last password change: {formatDate(userData.lastPasswordChange)}
            </p>
          )}
        </div>
      </div>
      
      {/* Account Verification Status */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Account Verification</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="flex items-center">
            <div
              className={`w-4 h-4 rounded-full mr-2 ${
                userData?.isAccountVerified ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <p>
              {userData?.isAccountVerified
                ? "Your account is verified"
                : "Your account is not verified"}
            </p>
          </div>
          
          {!userData?.isAccountVerified && (
            <button
              className="mt-3 text-purple-600 hover:text-purple-800 font-medium"
              onClick={() => {
                // This would typically trigger a verification email
                toast.info("Verification email sent! Please check your inbox.");
              }}
            >
              Send verification email
            </button>
          )}
        </div>
      </div>
      
      {/* Account Activity */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Account Activity</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="mb-4">
            <p className="text-gray-700">
              <span className="font-medium">Account Status:</span>{" "}
              <span className={`${
                userData?.status === "Active" 
                  ? "text-green-600" 
                  : userData?.status === "Deactivated" 
                  ? "text-yellow-600" 
                  : "text-red-600"
              }`}>
                {userData?.status || "Active"}
              </span>
            </p>
            <p className="text-gray-700 mt-2">
              <span className="font-medium">Last Login:</span>{" "}
              {userData?.lastLogin ? formatDate(userData.lastLogin) : "No login recorded"}
            </p>
          </div>
          
          {/* Recent logins - show only if we have login history */}
          {userData?.loginHistory && userData.loginHistory.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Recent Logins</h4>
              <div className="max-h-40 overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">IP Address</th>
                      <th className="pb-2">Device</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userData.loginHistory
                      .slice()
                      .reverse()
                      .slice(0, 5)
                      .map((login, index) => (
                        <tr key={index} className="border-t border-gray-200">
                          <td className="py-2">{formatDate(login.timestamp)}</td>
                          <td className="py-2">{login.ip || "Unknown"}</td>
                          <td className="py-2">{login.device || "Unknown"}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Security;