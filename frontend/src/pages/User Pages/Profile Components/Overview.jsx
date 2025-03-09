import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ProfileOverview = () => {
  const { userData, setUserData, backendUrl } = useContext(AppContext);
  const [initialized, setInitialized] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    street: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    dateOfBirth: "",
    gender: "Other",
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    if (userData && !initialized) {
      setFormData({
        name: userData?.name || "",
        phoneNumber: userData?.profile?.phoneNumber || "",
        street: userData?.profile?.address?.street || "",
        city: userData?.profile?.address?.city || "",
        state: userData?.profile?.address?.state || "",
        country: userData?.profile?.address?.country || "",
        zipCode: userData?.profile?.address?.zipCode || "",
        dateOfBirth: userData?.profile?.dateOfBirth
          ? new Date(userData.profile.dateOfBirth).toISOString().split("T")[0]
          : "",
        gender: userData?.profile?.gender || "Other",
      });
      setInitialized(true);
    }
  }, [userData, initialized]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    if (!userData?._id) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);

      const profileObj = {
        phoneNumber: formData.phoneNumber,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
        },
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      };

      formDataToSend.append("profile", JSON.stringify(profileObj));

      if (image) {
        formDataToSend.append("profilePic", image);
      }

      const response = await axios.put(
        `${backendUrl}/api/user/update/${userData._id}`,
        formDataToSend
      );

      setUserData(response.data.user);
      setInitialized(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overview-container">
      <h2 className="text-xl font-semibold text-purple-700 mb-6">Profile Overview</h2>
      
      {/* Profile Picture Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Profile Picture</h3>
        <div className="bg-gray-50 p-4 rounded-md flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="flex-shrink-0">
              {userData?.profilePic ? (
                <img
                  src={userData.profilePic}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-2 border-purple-600 object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full border-2 border-purple-600 flex items-center justify-center bg-gray-200 text-2xl font-bold text-gray-600">
                  {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="hidden"
                id="fileUpload"
              />
              <label
                htmlFor="fileUpload"
                className="px-4 py-2 bg-purple-600 text-white rounded-md cursor-pointer hover:bg-purple-700 inline-block text-center text-sm font-medium"
              >
                Change Profile Picture
              </label>
              <p className="text-sm text-gray-600">Recommended size: 500x500 pixels</p>
            </div>
          </div>
          {image && (
            <div className="text-sm text-gray-600">
              Selected file: {image.name}
            </div>
          )}
        </div>
      </div>

      {/* Basic Information Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Basic Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="name">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="phoneNumber">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="dateOfBirth">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="gender">
                  Gender
                </label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unknown">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Address Information</h3>
        <div className="bg-gray-50 p-4 rounded-md">
          <div className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2 font-medium" htmlFor="street">
                Street Address
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter street address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="city">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="state">
                  State/Province
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter state"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="country">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter country"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium" htmlFor="zipCode">
                  ZIP/Postal Code
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter ZIP code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div>
        <button
          onClick={handleUpdate}
          disabled={loading}
          className={`px-6 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
          }`}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfileOverview;
