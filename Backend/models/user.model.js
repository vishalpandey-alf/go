const mongoose = require ('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//User Schema
const userSchema = new mongoose.Schema({
    fullname: {
        firstname:{
            type: String,
            required: true,
            minlength: [3, 'FirstName must be atleast of 3 characters'],
        },   
        lastname:{
            type: String,
            minlength: [3, 'LastName must be atleast of 3 characters'],
        },
        
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minlength: [5, 'Email must be atleast 5 characters'],
    },
    password: {
        type: String,
        required: true,
        select: false,
    },

    socketID: {
        type: String,
    },
})

// Method to generate JWT token for authentication
userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({_id: this._id}, process.env.JWT_SECRET, {expiresIn: '24h'});
    return token;
}

// Method to compare the provided password with the stored hashed password
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// Static method to hash the password before saving it to the database
userSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

// Create the user model using the defined schema
const userModel = mongoose.model('user', userSchema);

module.exports = userModel;