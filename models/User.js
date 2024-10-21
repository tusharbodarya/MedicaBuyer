const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: false,
        unique: true,
    },
    password: {
        type: String,
        required: false,
    },
    phone: {
        type: String,
        required: false,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isphoneVerified: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        required: false,
    },
    emailVerificationToken: {
        type: String,
        required: false,
    },
    role: { type: String, enum: ['admin', 'vendor', 'user'], default: 'user' },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
