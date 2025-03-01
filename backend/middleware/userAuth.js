import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized, no token found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await userModel.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        next();
    } catch (error) {
        res.status(401).json({ success: false, message: 'Invalid token' });
    }
};

export default userAuth;

// const userAuth = async (req, res, next) => {

//     const {token} = req.cookies;

//     if(!token) {
//         return res.status(401).json({success: false, message: "User not authenticated. Login again."});
//     }

//     try {

//         const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        
//           // Fetch user details from database
//           const user = await userModel.findById(tokenDecoded.id).select("-password"); // Exclude password
//           if (!user) {
//               return res.status(401).json({ success: false, message: "User not found." });
//           }
  
//           req.user = user; // Attach user object to req
//           next();
//       } catch (error) {
//           return res.status(500).json({ success: false, message: error.message });
//       }
//     };

// export default userAuth;