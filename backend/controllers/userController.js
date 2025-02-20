import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);
        
        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        res.json({ 
            success: true, 
            userData: {
                name: user.name,
                verifyOtpExpireAt: user.verifyOtpExpireAt,
                isAccountVerified: user.isAccountVerified,
                _id: user._id,
            }
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

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