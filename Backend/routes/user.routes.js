const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');   


// Route to handle user registration with validation checks for fullname, email, and password fields    
router.post('/register', [
    body('fullname.firstname').isLength({min: 3}).withMessage('FirstName must be atleast of 3 characters'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').isLength({min: 6}).withMessage('Password must be atleast of 6 characters'),
],
userController.registerUser);

// Route to handle user login with validation checks for email and password fields
router.post('/login', [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').exists().withMessage('Password is required'),
],
userController.loginUser);

// Protected route to get user profile, accessible only to authenticated users
router.get('/profile', authMiddleware.authUser, userController.getUserProfile);

router.get('/logout', authMiddleware.authUser, userController.logoutUser);  

module.exports = router;