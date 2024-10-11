// routes/authRoutes.js
const express = require('express');
const { register, login, googleSignIn } = require('../../controllers/api/authController');
const { validateRequest, registerValidations } = require('../../utils/validators');
const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */


// Register route
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *               phone:
 *                 type: string
 *                 description: User phone number
 *               otp:
 *                 type: string
 *                 description: OTP for verification
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Server error
 */
router.post('/register', registerValidations, validateRequest, register);

// Login route
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User email
 *               password:
 *                 type: string
 *                 description: User password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', login);

// Google Sign-In route
/**
 * @swagger
 * /api/auth/google-signin:
 *   post:
 *     summary: Google Sign-In
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google token
 *     responses:
 *       200:
 *         description: User signed in with Google
 *       500:
 *         description: Server error
 */
router.post('/google-signin', googleSignIn);

module.exports = router;
