const { body, validationResult } = require('express-validator');

exports.registerValidator = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
];

exports.loginValidator = [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
];
