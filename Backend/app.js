// Importing necessary modules and initializing the Express application
const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const cookieParser = require('cookie-parser');
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
connectToDb();
const captainRoutes = require('./routes/captain.routes');

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Basic route to test if the server is running
app.get('/',(req,res) =>{
    res.send('Hello world');
});

// Configuring the user routes for handling user-related API endpoints
app.use('/api/users', userRoutes);

// Configuring the captain routes for handling captain-related API endpoints
app.use('/api/captains', captainRoutes);

module.exports = app;