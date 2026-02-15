// Import necessary modules and services
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');
const blackListTokenModel = require('../models/blacklistToken.model');  

// Controller function to handle user registration
module.exports.registerUser = async (req, res) => {
    // Validate the incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    // Check if a user with the same email already exists
    const isUserAlready = await userModel.findOne({ email });
    if (isUserAlready) {
        return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await userModel.hashPassword(password);
    
    try {

        const user = await userService.createUser({
            firstname: fullname.firstname,
            lastname: fullname.lastname,
            email,
            password: hashedPassword,
        });

        const token = user.generateAuthToken();

        return res.status(201).json({ token, user });

    } catch (err) {
        console.error("Registration error:", err);
        return res.status(500).json({ message: "Internal Server Error" });
    }
};

// Controller function to handle user login
module.exports.loginUser = async (req, res) => {
    // Validate the incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    const user = await userModel.findOne({ email }).select('+password');
    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    
    const token = user.generateAuthToken();

    res.cookie('token', token);
    
    res.status(200).json({ token, user });
}

// Controller function to get user profile
module.exports.getUserProfile = async (req, res) => {
    res.status(200).json({ user: req.user });
}

// Controller function to handle user logout
module.exports.logoutUser = async (req, res) => {   
    res.clearCookie('token');

    const token = req.cookies.token || req.headers.authorization.split(' ')[1];
    await blackListTokenModel.create({ token });
    res.status(200).json({ message: "Logged out successfully" });

}