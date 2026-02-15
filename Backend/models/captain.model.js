const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Schema for the Captain model with fields for name, rank, and ship
const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true, minlength: 3, message: "FirstName must be at least 3 characters long" },
        lastname: { type: String, required: true, minlength: 3, message: "LastName must be at least 3 characters long" },
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    socketId: {
        type: String,
    },
    status: {
        type: String,
        enum: ['active','inactive' ],
        default: 'inactive',
    },

    vehicle: {
        color: {
            type: String,
            required: true,
            minlength: [3, "Color must be at least 3 characters long"],
        },
        plate: {
            type: String,
            required: true,
            minlength: [3, "Plate must be at least 3 characters long"],
        },
        capacity: {
            type: Number,
            required: true,
            min: [1, "Capacity must be at least 1"],
        },
        vehicleType: {
            type: String,
            required: true,
            enum: ['car', 'motorcycle', 'auto'],
        },
        location: {
            lat: {
                type: Number,
            },
            lng: {
                type: Number,
            },
        },

    },

});

// Method to generate JWT for authentication
captainSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    return token;
}

// Method to compare provided password with the hashed password in the database
captainSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

// Static method to hash passwords before saving to the database
captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
}

const captainModel = mongoose.model('captain', captainSchema);
module.exports = captainModel;