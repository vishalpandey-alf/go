const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const app = express();
const connectToDb = require('./db/db');
const userRoutes = require('./routes/user.routes');
connectToDb();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/',(req,res) =>{
    res.send('Hello world');
});

// Configuring the user routes for handling user-related API endpoints
app.use('/api/users', userRoutes);

module.exports = app;