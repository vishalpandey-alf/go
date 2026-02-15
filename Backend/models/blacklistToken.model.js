const mongoose = require('mongoose');

// Schema for storing blacklisted JWTs with a 24-hour TTL
const blacklistTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  // createdAt + TTL index: document will expire 24 hours (86400 seconds) after this date
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // 24 hours in seconds
  },
});


module.exports = mongoose.model('BlacklistToken', blacklistTokenSchema);
