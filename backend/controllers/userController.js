import cloudinary from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



export const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, password, profile } = req.body; // Expect profile to be an object
    let profilePic = req.file?.path; // Multer provides file info if uploaded

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Upload profile picture to Cloudinary if provided
    if (req.file) {
      const uploadResult = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });
      profilePic = uploadResult.secure_url;
    }

    // Build the update data object dynamically
    const updateData = {};

    if (name) updateData.name = name;
    if (profilePic) updateData.profilePic = profilePic;
    if (profile) {
      let parsedProfile;
      try {
        parsedProfile = typeof profile === "string" ? JSON.parse(profile) : profile;
      } catch (err) {
        return res.status(400).json({ success: false, message: "Invalid profile format" });
      }
      updateData.profile = parsedProfile;
    }

    // Hash the password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateData.password = hashedPassword;
    }

    // Update the user document in MongoDB
    const user = await userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, message: "User updated successfully!", user });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add the deleteUser function
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await userModel.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};