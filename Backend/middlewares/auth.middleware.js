const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');

module.exports.authUser = async (req, res, next) => {
    // 1. Safe check for token (using optional chaining)
    const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Access Denied. No token provided." });
    }
    // Check if the token is blacklisted
    const isBlacklisted = await userModel.findOne({ token: token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized: Logged out." });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Find user and exclude password for security
        const user = await userModel.findById(decoded._id); // Ensure you use _id or id based on your schema

        if (!user) {
            return res.status(401).json({ message: "User not found." });
        }

        req.user = user;
        return next();
        
    } catch (err) {
        // 4. Detailed error logging for Docker logs
        console.error("Auth Middleware Error:", err.message);
        return res.status(401).json({ message: "Invalid or expired token." });
    }
}