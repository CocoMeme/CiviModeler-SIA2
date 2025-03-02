import cloudinary from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userModel from "../models/userModel.js"; // Adjust path if needed

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
      let { name, phoneNumber, address } = req.body;
      let profilePic = req.file?.path; // Multer uploads file, path contains Cloudinary URL
  
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
  
      // // Update user fields dynamically
      const updateData = {};
      // if (name) updateData.name = name;
      if (profilePic) updateData.profilePic = profilePic;
      // if (phoneNumber) updateData["profile.phoneNumber"] = phoneNumber;
      // if (address) updateData["profile.address"] = JSON.parse(address);
  
      const user = await userModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      res.status(200).json({ success: true, message: "User updated successfully!", user });
    } catch (error) {
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