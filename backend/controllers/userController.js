import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id).select('-password'); // Exclude password

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, userData: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// export const getUserData = async (req, res) => {
//     // Check if req.user exists (authentication middleware should set this)
//     if (!req.user) {
//         return res.status(401).json({ success: false, message: "User not authenticated." });
//     }

//     try {
//         // Fetch user data from the database, excluding password
//         const user = await UserModel.findById(req.user._id).select("-password");

//         if (!user) {
//             return res.status(404).json({ success: false, message: "User not found." });
//         }

//         // Send the user data as a response
//         res.json({ success: true, userData: user });
//     } catch (error) {
//         res.status(500).json({ success: false, message: "Server error. Please try again later." });
//     }
// };


export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json({ success: true, users });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add the updateUser function
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { isAccountVerified } = req.body;

        const user = await userModel.findByIdAndUpdate(id, { isAccountVerified }, { new: true });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "User updated successfully", user });
    } catch (error) {
        res.json({ success: false, message: error.message });
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