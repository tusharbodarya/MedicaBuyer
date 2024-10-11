const Review = require('../../models/Review');
const path = require('path');
const fs = require('fs');
const validator = require('validator'); // Import validator

// Helper function to check image file type
const isValidImage = (fileName) => {
    const ext = path.extname(fileName).toLowerCase();
    return ['.png', '.jpg', '.jpeg'].includes(ext);
};

// List all reviews
exports.listReviews = async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.render('admin/reviews/list', { reviews: reviews, title: 'List Reviews' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Show create review form
exports.createReviewForm = (req, res) => {
    res.render('admin/reviews/create', { title: 'Create Review' });
};

// Validate inputs
exports.validateReviewInput = (req, res, next) => {
    const { name, rating, review } = req.body;
    const image = req.file ? req.file.filename : '';

    // Check if all fields are provided
    let errors = [];

    if (!name || validator.isEmpty(name.trim()) || !validator.isAlpha(name.trim(), 'en-US', { ignore: ' ' })) {
        errors.push('Invalid name (should only contain letters).');
    }

    if (!image || !isValidImage(image)) {
        errors.push('Invalid image (only JPG, PNG formats are allowed).');
    }

    if (!rating || !validator.isInt(rating, { min: 1, max: 5 })) {
        errors.push('Invalid rating (should be between 1 and 5).');
    }

    if (!review || validator.isEmpty(review.trim())) {
        errors.push('Review cannot be empty.');
    }

    if (errors.length > 0) {
        res.render('admin/reviews/create', { errors, name, rating, review, title: 'Create Review' });
    } else {
        next();
    }
};

// Insert a new review
exports.createReview = async (req, res) => {
    try {
        const { name, rating, review } = req.body;
        const image = req.file ? `/uploads/review-images/${req.file.filename}` : null;

        const newReview = new Review({
            name,
            image,
            rating,
            review
        });

        await newReview.save();
        res.redirect('/admin/reviews');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Show edit review form
exports.editReviewForm = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            return res.status(404).send('Review not found');
        }
        res.render('admin/reviews/edit', { review, title: 'Edit Review' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Validate update inputs
exports.validateReviewUpdateInput = (req, res, next) => {
    const { name, rating, review } = req.body;
    const image = req.file ? req.file.filename : '';

    let errors = [];

    if (!name || validator.isEmpty(name.trim()) || !validator.isAlpha(name.trim(), 'en-US', { ignore: ' ' })) {
        errors.push('Invalid name (should only contain letters).');
    }

    if (image && !isValidImage(image)) {
        errors.push('Invalid image (only JPG, PNG formats are allowed).');
    }

    if (!rating || !validator.isInt(rating, { min: 1, max: 5 })) {
        errors.push('Invalid rating (should be between 1 and 5).');
    }

    if (!review || validator.isEmpty(review.trim())) {
        errors.push('Review cannot be empty.');
    }

    if (errors.length > 0) {
        res.render('admin/reviews/edit', { errors, review, title: 'Edit Review' });
    } else {
        next();
    }
};

// Update review
exports.updateReview = async (req, res) => {
    try {
        const { name, rating, review } = req.body;
        const reviewToUpdate = await Review.findById(req.params.id);

        if (!reviewToUpdate) {
            return res.status(404).send('Review not found');
        }

        reviewToUpdate.name = name;
        reviewToUpdate.rating = rating;
        reviewToUpdate.review = review;

        // Handle image update if a new image is uploaded
        if (req.file) {
            // Delete old image if it exists
            const oldImagePath = path.join(__dirname, '..', reviewToUpdate.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            // Assign new image
            reviewToUpdate.image = `/uploads/review-images/${req.file.filename}`;
        }

        await reviewToUpdate.save();
        res.redirect('/admin/reviews');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).send('Review not found');
        }

        // Delete image from the file system
        const imagePath = path.join(__dirname, '..', review.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Review.findByIdAndDelete(req.params.id);
        res.redirect('/admin/reviews');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
