const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const awardController = require('../../controllers/admin/awardController');

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/awards-images/'); // Uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
    }
});
const upload = multer({ storage });

// List all Awards
router.get('/awards', awardController.listAwards);

// Create Award form
router.get('/awards/create', awardController.createAwardForm);

// Create new Award
router.post('/awards', upload.single('image'), awardController.createAward);

// Edit Award form
router.get('/awards/edit/:id', awardController.editAwardForm);

// Update Award
router.post('/awards/edit/:id', upload.single('image'), awardController.updateAward);

// Delete Award
router.get('/awards/delete/:id', awardController.deleteAward);

module.exports = router;
