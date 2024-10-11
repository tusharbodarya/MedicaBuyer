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
    mobile: {
        type: String,
        required: false,
        unique: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    isMobileVerified: {
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
