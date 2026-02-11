const mongoose = require('mongoose');

function connectToDb() {
    // We use .then() for a successful connection and .catch() for errors
    mongoose.connect(process.env.DB_CONNECT)
        .then(() => {
            console.log('Connected to DB successfully');
        })
        .catch(err => {
            console.log('Error connecting to DB:', err);
        });
}

module.exports = connectToDb;