const express = require('express');
const router = express.Router();
const subCategoryController = require('../../controllers/admin/subCategoryController');
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'uploads/sub-category-images');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });
// List all sub-categories
router.get('/sub-categories', subCategoryController.listSubCategories);

// Show form for creating a new sub-category
router.get('/sub-categories/create', subCategoryController.createSubCategoryForm);

// Create a new sub-category
router.post('/sub-categories/create', upload.single('image'), subCategoryController.createSubCategory);

// Show form for editing a sub-category
router.get('/sub-categories/edit/:id', subCategoryController.editSubCategoryForm);

// Update a sub-category
router.post('/sub-categories/edit/:id', upload.single('image'), subCategoryController.updateSubCategory);

// Delete a sub-category
router.get('/sub-categories/delete/:id', subCategoryController.deleteSubCategory);

module.exports = router;
