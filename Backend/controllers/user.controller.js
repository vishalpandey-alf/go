// Import necessary modules and services
const userModel = require('../models/user.model');
const userService = require('../services/user.service');
const { validationResult } = require('express-validator');

// Controller function to handle user registration
module.exports.registerUser = async (req, res) => {
    // Validate the incoming request data
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { fullname, email, password } = req.body;

    try {
        const hashedPassword = await userModel.hashPassword(password);

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
    res.status(200).json({ token, user });
}

module.exports.getUserProfile = async (req, res) => {
    res.status(200).json({ user: req.user });
}