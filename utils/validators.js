const { body, validationResult } = require('express-validator');

/**
 * Validate request data
 * @param {Array} validations - Array of validation rules
 */
const validateRequest = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    };
};

const registerValidations = [
    body('email').optional().isEmail().withMessage('Invalid email'),
    body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone').optional().isMobilePhone().withMessage('Invalid phone number'),
    body('otp').optional().isLength({ min: 4, max: 6 }).withMessage('Invalid OTP')
];

module.exports = { validateRequest, registerValidations };