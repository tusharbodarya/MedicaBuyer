// routes/admin/categoryRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const categoryController = require('../../controllers/admin/categoryController');

// Set up multer for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/category-images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Admin category routes
router.get('/categories', categoryController.getCategories); // List categories
router.get('/categories/add', categoryController.addCategoryPage); // Render add category page
router.post('/categories/add', upload.single('image'), categoryController.addCategory); // Add category
router.get('/categories/edit/:id', categoryController.editCategoryPage); // Render edit category page
router.post('/categories/edit/:id', upload.single('image'), categoryController.updateCategory); // Update category
router.get('/categories/delete/:id', categoryController.deleteCategory); // Delete category

module.exports = router;
