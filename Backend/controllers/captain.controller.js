const captainModel = require('../models/captain.model');
const captainService = require('../services/captain.service');
const { validationResult } = require('express-validator');

// Controller function to handle captain registration
module.exports.registerCaptain = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request body to get captain details
    const {fullname, email, password, vehicle} = req.body;

    // Check if a captain with the same email already exists
    const isCaptainAlreadyExist = await captainModel.findOne({ email });
    if (isCaptainAlreadyExist) {
        return res.status(400).json({ message: "Captain with this email already exists" });
    }

    // Hash the password before saving to the database
    const hashedPassword = await captainModel.hashPassword(password);

    const captain = await captainService.createCaptain({
        firstname: fullname.firstname,
        lastname: fullname.lastname,
        email,
        password: hashedPassword,
        color: vehicle.color,
        plate: vehicle.plate,
        capacity: vehicle.capacity,
        vehicleType: vehicle.vehicleType
    });

    const token = captain.generateAuthToken();
    res.status(201).json({ token, captain });
}

// Controller function to handle captain login
module.exports.loginCaptain = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Destructure the request body to get email and password
    const { email, password } = req.body;
    
    // Find the captain by email and include the password field for comparison
    const captain = await captainModel.findOne({ email }).select('+password');      
    if (!captain) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    
    // Compare the provided password with the hashed password in the database
    const isMatch = await captain.comparePassword(password);
    if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token for the authenticated captain
    const token = captain.generateAuthToken();
    
    // Set the token in a cookie for client-side storage (optional)
    res.cookie('token', token);
    
    // Respond with the token and captain details
    res.status(200).json({ token, captain });

}

module.exports.getCaptainProfile = async (req, res, next) => {
    res.status(200).json({ captain: req.captain });
}

module.exports.logoutCaptain = async (req, res, next) => {