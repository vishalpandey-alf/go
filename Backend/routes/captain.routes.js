const captainController = require('../controllers/captain.controller'); 
const express = require('express');
const router = express.Router();
const {body} = require('express-validator');

// Importing the captain controller to handle captain-related operations
router.post('/register', [
    body('fullname.firstname').isLength({min: 3}).withMessage('FirstName must be atleast of 3 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast of 6 characters'),
    body('vehicle.color').isLength({min: 3}).withMessage('Color must be atleast of 3 characters'),
    body('vehicle.plate').isLength({min: 3}).withMessage('Plate must be atleast of 3 characters'),
    body('vehicle.capacity').isInt({min: 1}).withMessage('Capacity must be atleast of 1'),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage('Vehicle type must be either car, motorcycle, or auto'),
],
captainController.registerCaptain);



module.exports = router;