import React, { useContext, useState, useEffect } from "react";
import { AppContext } from "../../../context/AppContext";
import axios from "axios";

const ProfileOverview = () => {
  const { userData, setUserData, backendUrl } = useContext(AppContext);

  const defaultProfile = userData?.profile || {};
  const defaultAddress = defaultProfile.address || {};

  const [formData, setFormData] = useState({
    name: userData?.name || "",
    phoneNumber: defaultProfile.phoneNumber || "",
    street: defaultAddress.street || "",
    city: defaultAddress.city || "",
    state: defaultAddress.state || "",
    country: defaultAddress.country || "",
    zipCode: defaultAddress.zipCode || "",
    dateOfBirth: defaultProfile.dateOfBirth ? new Date(defaultProfile.dateOfBirth).toISOString().split("T")[0] : "",
    gender: defaultProfile.gender || "Other",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    setFormData({
      name: userData?.name || "",
      phoneNumber: userData?.profile?.phoneNumber || "",
      street: userData?.profile?.address?.street || "",
      city: userData?.profile?.address?.city || "",
      state: userData?.profile?.address?.state || "",
      country: userData?.profile?.address?.country || "",
      zipCode: userData?.profile?.address?.zipCode || "",
      dateOfBirth: userData?.profile?.dateOfBirth ? new Date(userData.profile.dateOfBirth).toISOString().split("T")[0] : "",
      gender: userData?.profile?.gender || "Other",
    });
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    setLoading(true);
    setMessage("");
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append("gender", formData.gender);
  
      // Ensure address is correctly structured
      formDataToSend.append(
        "address",
        JSON.stringify({
          street: formData.street,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          zipCode: formData.zipCode,
        })
      );
  
      if (image) {
        formDataToSend.append("profilePic", image);
      }
  
      const response = await axios.put(`${backendUrl}/api/user/update/${userData._id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      setUserData(response.data.user); // Update global state
      setMessage("Profile updated successfully!");
    } catch (error) {
      setMessage("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="grid grid-cols-12 gap-6 bg-white p-6 shadow-md rounded-lg">
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
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className="hidden" id="fileUpload" />
        <label htmlFor="fileUpload" className="cursor-pointer text-purple-700 font-semibold hover:underline">
          Edit Profile Picture
        </label>

        {/* User Info */}
        <div className="text-center">
          <p className="text-lg font-semibold">{userData?.name}</p>
          <p className="text-gray-600">{userData?.email}</p>
        </div>
      </div>

      {/* Right Column: Profile Details Form */}
      <div className="col-span-9">
        <div className="grid grid-cols-12 gap-4">
          {/* Labels Column (Smaller) */}
          <div className="col-span-4 text-right space-y-4">
            <p className="font-semibold">Name:</p>
            <p className="font-semibold">Phone Number:</p>
            <p className="font-semibold">Date of Birth:</p>
            <p className="font-semibold">Gender:</p>
            <p className="font-semibold">Street:</p>
            <p className="font-semibold">City:</p>
            <p className="font-semibold">State:</p>
            <p className="font-semibold">Country:</p>
            <p className="font-semibold">Zip Code:</p>
          </div>

          {/* Inputs Column (Larger) */}
          <div className="col-span-8 space-y-4">
            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full p-2 border rounded" />
            <select name="gender" value={formData.gender} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="text" name="country" value={formData.country} onChange={handleChange} className="w-full p-2 border rounded" />
            <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
        </div>

        {/* Update Button */}
        <button onClick={handleUpdate} className={`mt-4 w-full p-2 text-white rounded ${loading ? "bg-gray-500" : "bg-purple-700 hover:bg-purple-800"}`} disabled={loading}>
          {loading ? "Updating..." : "Update Profile"}
        </button>

        {/* Success/Error Message */}
        {message && <p className="text-center text-green-600 mt-2">{message}</p>}
      </div>
    </div>
  );
};

export default ProfileOverview;
