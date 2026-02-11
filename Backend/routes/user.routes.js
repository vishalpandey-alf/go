const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');

// Route to handle user registration with validation checks for fullname, email, and password fields    
router.post('/register', [
    body('fullname.firstname').isLength({min: 3}).withMessage('FirstName must be atleast of 3 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast of 6 characters'),
],
userController.registerUser);

module.exports = router;