const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const reviewController = require('../../controllers/admin/reviewController');

// Multer setup for handling image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/review-images');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});
const upload = multer({ storage });

// List reviews
router.get('/reviews', reviewController.listReviews);

// Create review form
router.get('/reviews/create', reviewController.createReviewForm);

// Create a new review with validation (ensure these functions exist in your controller)
router.post('/reviews', upload.single('image'), reviewController.validateReviewInput, reviewController.createReview);

// Edit review form
router.get('/reviews/edit/:id', reviewController.editReviewForm);

// Update review with validation
router.post('/reviews/edit/:id', upload.single('image'), reviewController.validateReviewUpdateInput, reviewController.updateReview);

// Delete review
router.get('/reviews/delete/:id', reviewController.deleteReview);

module.exports = router;
