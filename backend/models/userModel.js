import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },
    verifyOtp: { type: String, default: ''},
    verifyOtpExpireAt: { type: Number, default: 0},
    isAccountVerified: { type: Boolean, default: 0},
    resetOtp: { type: String, default: ''},
    resetOtpExpireAt: { type: Number, default: 0},
    isDeleted: {
        type: Boolean,
        default: false
      }
})

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;