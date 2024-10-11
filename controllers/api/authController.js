// controllers/authController.js
const User = require('../../models/User');
const { sendResponse } = require('../../utils/response');
const { verifyGoogleToken } = require('../../services/googleAuth');
const { sendOtp } = require('../../utils/sendOtp');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Register a new user
 */
exports.register = async (req, res) => {
    const { email, password, phone, otp } = req.body;

    try {
        // Check if the user already exists
        let user = await User.findOne({ $or: [{ email }, { phone }] });
        if (user) {
            return sendResponse(res, 400, 'User already exists');
        }

        // Create a new user
        user = new User({
            email,
            password,
            phone,
            isVerified: otp ? true : false // Assume OTP is verified if provided
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save user
        await user.save();

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        sendResponse(res, 201, 'User registered successfully', { token });
    } catch (err) {
        sendResponse(res, 500, 'Server Error');
    }
};

/**
 * Login a user
 */
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return sendResponse(res, 400, 'Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendResponse(res, 400, 'Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        sendResponse(res, 200, 'User logged in successfully', { token });
    } catch (err) {
        sendResponse(res, 500, 'Server Error');
    }
};

/**
 * Google Sign-In
 */
exports.googleSignIn = async (req, res) => {
    const { token } = req.body;

    try {
        // Verify Google token
        const payload = await verifyGoogleToken(token);

        // Check if user already exists
        let user = await User.findOne({ googleId: payload.sub });
        if (!user) {
            // Create a new user if not exists
            user = new User({
                email: payload.email,
                googleId: payload.sub,
                isVerified: true
            });
            await user.save();
        }

        // Generate JWT token
        const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        sendResponse(res, 200, 'User signed in with Google', { token: jwtToken });
    } catch (err) {
        sendResponse(res, 500, 'Server Error');
    }
};
