// controllers/categoryController.js
const Category = require('../../models/Category');
const path = require('path');
const fs = require('fs');

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await Category.find({});
        res.render('admin/categories/listCategories', { categories: categories, title: 'List Categories' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Render add category page
exports.addCategoryPage = (req, res) => {
    res.render('admin/categories/addCategory', { title: 'Add Category' });
};

// Add category (with image upload)
exports.addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Handle image upload
        if (!req.file) {
            return res.status(400).send('Image is required');
        }

        const imagePath = `/uploads/category-images/${req.file.filename}`;

        const newCategory = new Category({
            name,
            image: imagePath
        });

        await newCategory.save();
        res.redirect('/admin/categories');
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
};

// Render edit category page
exports.editCategoryPage = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        res.render('admin/categories/editCategory', { category: category, title: 'Edit Category' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Update category
exports.updateCategory = async (req, res) => {
    try {
        const { name } = req.body;
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        // If a new image is uploaded, update it
        if (req.file) {
            // Delete old image
            const oldImagePath = category.image;
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }

            // Update with new image path
            category.image = `/uploads/category-images/${req.file.filename}`;
        }

        // Update name
        category.name = name;

        await category.save();
        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Delete category
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).send('Category not found');
        }

        // Delete image from the file system
        const imagePath = path.join(__dirname, '..', category.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await Category.findByIdAndDelete(req.params.id);

        res.redirect('/admin/categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
