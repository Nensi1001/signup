const mongoose = require('mongoose');

const OTPSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


const OTPModel = mongoose.model('OTP', OTPSchema);

module.exports = OTPModel;