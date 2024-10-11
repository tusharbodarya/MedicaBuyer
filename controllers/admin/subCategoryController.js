const SubCategory = require('../../models/SubCategory');
const Category = require('../../models/Category');
const path = require('path');
const fs = require('fs');

// List all sub-categories
exports.listSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().populate('category');
        res.render('admin/sub-categories/listSubCategories', { subCategories: subCategories, title: 'List Sub-Categories' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Create sub-category form
exports.createSubCategoryForm = async (req, res) => {
    try {
        const categories = await Category.find();  // Get list of categories to show in the form
        res.render('admin/sub-categories/createSubCategory', { categories: categories, title: 'Create Sub-Category' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Create sub-category
exports.createSubCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;

        if (!req.file) {
            return res.status(400).send('Image is required');
        }

        const imagePath = `/uploads/sub-category-images/${req.file.filename}`;

        const subCategory = new SubCategory({
            name,
            category: categoryId,
            image: imagePath
        });
        await subCategory.save();
        res.redirect('/admin/sub-categories');
    } catch (error) {
        res.status(500).send(error);
    }
};

// Edit sub-category form
exports.editSubCategoryForm = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);
        const categories = await Category.find(); // Fetch all categories to choose from in form
        if (!subCategory) {
            return res.status(404).send('Sub-category not found');
        }
        res.render('admin/sub-categories/editSubCategory', { subCategory: subCategory, categories: categories, title: 'Edit Sub-Category' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Update sub-category
exports.updateSubCategory = async (req, res) => {
    try {
        const { name, categoryId } = req.body;
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).send('Sub-category not found');
        }

        // Update image if a new one is uploaded
        if (req.file) {
            const imagePath = subCategory.image;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath); // Remove the old image
            }
            subCategory.image = `/uploads/sub-category-images/${req.file.filename}`;
        }

        subCategory.name = name;
        subCategory.category = categoryId;

        await subCategory.save();
        res.redirect('/admin/sub-categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Delete sub-category
exports.deleteSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findById(req.params.id);

        if (!subCategory) {
            return res.status(404).send('Sub-category not found');
        }

        const imagePath = path.join(__dirname, '..', '..', subCategory.image);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath); // Remove image from file system
        }

        await SubCategory.findByIdAndDelete(req.params.id);
        res.redirect('/admin/sub-categories');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
