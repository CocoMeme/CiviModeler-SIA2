import jwt from "jsonwebtoken";


const userAuth = async (req, res, next) => {

    const {token} = req.cookies;

    if(!token) {
        return res.status(401).json({success: false, message: "User not authenticated. Login again."});
    }

    try {

        const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokenDecoded.id) {
            req.body.userId = tokenDecoded.id;
        } else {
            return res.status(401).json({success: false, message: "User not authenticated. Login again."});
        }

        next();
        
    } catch (error) {
        return res.status(500).json({success: false, message: error.message});
    }


}

export default userAuth;