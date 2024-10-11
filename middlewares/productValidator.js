const { check } = require('express-validator');

const productValidator = [
    check('category').not().isEmpty().withMessage('Category is required'),
    check('subcategory').not().isEmpty().withMessage('Sub Category is required'),
    check('name').isLength({ min: 2 }).withMessage('Product name must be at least 2 characters long'),
    check('price').isNumeric().withMessage('Price must be a number'),
    check('model_number').not().isEmpty().withMessage('Model number is required'),
    check('key_features').not().isEmpty().withMessage('Key features are required'),
    check('product_description').not().isEmpty().withMessage('Product description is required'),
    check('warranty').not().isEmpty().withMessage('Warranty is required')
];

module.exports = productValidator;
