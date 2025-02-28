import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please fill all fields" });
    }

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword }); 

        await user.save();
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        // Sending Welcome Email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to our website",
            text: `Hello ${name}, welcome to our CiviModeler. We're glad to have you. Your account has been created successfully with the email: ${email}.`
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error("Error sending welcome email:", emailError);
        }

        return res.status(201).json({ success: true, message: "User registered and logged in successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and Password are required" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ 
            success: true, 
            message: "User logged in successfully",
            isAdmin: user.isAdmin // Include isAdmin in the response
        });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        });

        return res.json({ success: true, message: "Logged out successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const sendVerifyOtp = async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await userModel.findById(userId);

        if (user.isAccountVerified) {
            return res.status(400).json({ success: false, message: "Account already verified" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Hello ${user.name}! Your OTP for account verification is ${otp}. It will expire in 24 hours.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "OTP sent successfully" });
        

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const verifyEmail = async (req, res) => {
    
    const {userId, otp} = req.body;

    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "User ID and OTP are missing" });
    }

    try {

        const user = await userModel.findById(userId);

        if(!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if (user.verifyOtp === '' || user.verifyOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if(user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired. Please request a new OTP" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        res.json({ success: true, message: "Account verified successfully" });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export const isAuthenticated = async (req, res) => {
    try {
        return res.json({ success: true});
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}


// Send Password Reset OTP
export const sendResetOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" });
    }

    try {
        
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000));

        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Hello ${user.name}! Your OTP for password reset is ${otp}. Use this OTP to proceed with reseting your password. It will expire in 15 minutes.`
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: "OTP sent successfully" });


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }


}

// Reset User Password
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "Email, OTP and Password are required" });
    }

    try {
        
        const user = await userModel.findOne({ email });
        if(!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        }

        if(user.resetOpt === '' || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if(user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired. Please request a new OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;

        await user.save();

        res.json({ success: true, message: "Password reset successfully" });


    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }

}