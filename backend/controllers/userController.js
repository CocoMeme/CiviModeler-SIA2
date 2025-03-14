import cloudinary from "cloudinary";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import transporter from '../config/nodemailer.js';


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



export const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    // Find the user by ID
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let emailSubject = "";
    let emailText = "";

    // Update status and increment DeactivationCount if status is 'Deactivated'
    if (status === 'Deactivated') {
      user.DeactivationCount += 1;
      if (user.DeactivationCount >= 3) {
        user.status = 'Blocked';
        emailSubject = "Account Permanently Banned";
        emailText = "Your account has been permanently banned due to multiple deactivations. Please create a new account to continue using our services.";
      } else if (user.DeactivationCount === 2) {
        user.status = 'Deactivated';
        emailSubject = "Account Deactivated Again";
        emailText = "Your account has been deactivated again due to inactivity. If your account is deactivated once more, it will be permanently banned.";
      } else {
        user.status = 'Deactivated';
        emailSubject = "Account Deactivated";
        emailText = "Your account has been deactivated due to inactivity for a month.";
      }

      // Send email notification
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: user.email,
        subject: emailSubject,
        text: emailText,
      });
    } else {
      user.status = status;
    }

    // Save the updated user
    await user.save();

    res.status(200).json({ success: true, message: "User status updated successfully!", user });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

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

export const getGenderData = async (req, res) => {
  try {
    const genderData = await userModel.aggregate([
      { $group: { _id: "$profile.gender", count: { $sum: 1 } } }
    ]);

    const formattedData = genderData.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAccountStatusData = async (req, res) => {
  try {
    const statusData = await userModel.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    const formattedData = statusData.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const recordLoginHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { ip, device } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Add new login record
    user.loginHistory.push({ 
      timestamp: new Date(),
      ip: ip || "Unknown",
      device: device || "Unknown"
    });

    // Update last login time
    user.lastLogin = new Date();

    // Keep only last 10 login records
    if (user.loginHistory.length > 10) {
      user.loginHistory = user.loginHistory.slice(-10);
    }

    await user.save();
    res.json({ success: true, message: "Login history updated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Current password is incorrect" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password and lastPasswordChange
    user.password = hashedPassword;
    user.lastPasswordChange = new Date();

    await user.save();
    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getUserById = async (req, res) => {
  try {
      const user = await userModel.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.status(200).json({ success: true, user });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching user', error });
  }
};