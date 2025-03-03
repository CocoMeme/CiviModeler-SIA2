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

      // Create a profile object with nested fields
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

      // Append the profile object as a JSON string
      formDataToSend.append("profile", JSON.stringify(profileObj));

      if (image) {
        formDataToSend.append("profilePic", image);
      }

      // Remove the explicit "Content-Type" header so Axios sets the correct boundary automatically
      const response = await axios.put(
        `${backendUrl}/api/user/update/${userData._id}`,
        formDataToSend
      );

      setUserData(response.data.user);
      // Reset initialization so the form reinitializes with updated data
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
    <div className="grid grid-cols-12 gap-6 bg-white">
      {/* Left Column: Profile Picture & Basic Info */}
      <div className="col-span-3 flex flex-col items-center space-y-4">
        {userData?.profilePic ? (
          <img
            src={userData.profilePic}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-purple-700 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full border-4 border-purple-700 flex items-center justify-center bg-gray-300 text-2xl font-bold text-white">
            {userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        {/* Upload Profile Picture */}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="cursor-pointer text-purple-700 font-semibold hover:underline"
        >
          Edit Profile Picture
        </label>

        {/* User Info */}
        <div className="text-center">
          <p className="text-lg font-semibold">{userData?.name}</p>
          <p className="text-gray-600">{userData?.email}</p>
        </div>

        {/* Update Button - Always at the Bottom */}
        <button
          onClick={handleUpdate}
          className={`mt-auto w-full p-2 text-white rounded ${
            loading ? "bg-gray-500" : "bg-purple-700 hover:bg-purple-800"
          }`}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </div>

      {/* Right Column: Profile Details Form */}
      <div className="col-span-9 pl-10">
        <h2 className="text-lg font-semibold border-b pb-2">Personal Information</h2>
        
        <div className="mt-4 grid grid-cols-3 gap-2 items-center pl-10">
          <label className="text-left pr-2 col-span-1">
            <strong>Name:</strong>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          />

          <label className="text-left pr-2 col-span-1">
            <strong>Phone Number:</strong>
          </label>
          <input
            type="text"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          />

          <label className="text-left pr-2 col-span-1">
            <strong>Date of Birth:</strong>
          </label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          />

          <label className="text-left pr-2 col-span-1">
            <strong>Gender:</strong>
          </label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <label className="text-left pr-2 col-span-1">
            <strong>Street:</strong>
          </label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          />

          <label className="text-left pr-2 col-span-1">
            <strong>City:</strong>
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          />

          <label className="text-left pr-2 col-span-1">
            <strong>State:</strong>
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          />

          <label className="text-left pr-2 col-span-1">
            <strong>Country:</strong>
          </label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          />

          <label className="text-left pr-2 col-span-1">
            <strong>Zip Code:</strong>
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className="col-span-2 w-full p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
