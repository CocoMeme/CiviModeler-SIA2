import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    profilePic: { type: String, default: '' },
    isAdmin: { type: Boolean, default: false },

    // Account Verification & Security
    verifyOtp: { type: String, default: '' },
    verifyOtpExpireAt: { type: Number, default: 0 },
    Statusotp: { type: String, default: '' },
    StatusotpExpireAt: { type: Number, default: 0 },
    isAccountVerified: { type: Boolean, default: false },
    resetOtp: { type: String, default: '' },
    resetOtpExpireAt: { type: Number, default: 0 },
    lastLogin: { type: Date, default: null },
    status: { type: String, enum: ['Active', 'Deactivated', 'Blocked'], default: 'Active' },
    DeactivationCount: { type: Number, default: 0 },
    loginHistory: [
        {
            timestamp: { type: Date, default: Date.now },
            ip: { type: String, default: '' },
            device: { type: String, default: '' },
        }
    ],

    // Profile Details
    profile: {
        phoneNumber: { type: String, default: '' },
        address: {
            street: { type: String, default: '' },
            city: { type: String, default: '' },
            state: { type: String, default: '' },
            country: { type: String, default: '' },
            zipCode: { type: String, default: '' },
        },
        dateOfBirth: { type: Date, default: null },
        gender: { type: String, enum: ['Male', 'Female', 'Unknown'], default: 'Unknown' },
    },

    // Activity Tracking
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastPasswordChange: { type: Date, default: null },
});

// Automatically update `updatedAt` on save
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
