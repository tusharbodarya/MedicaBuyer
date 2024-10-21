const Product = require('../../models/Product');
const Category = require('../../models/Category');
const SubCategory = require('../../models/SubCategory');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/products/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).array('images', 10); // Multiple images

// List Products
exports.list = async (req, res) => {
    const products = await Product.find().populate('category subcategory');
    console.log(products);
    res.render('admin/products/list', { products, title: 'Products' });
};

// Render Create Form
exports.renderCreate = async (req, res) => {
    const categories = await Category.find();
    const subCategories = await SubCategory.find();
    res.render('admin/products/add', { categories, subCategories, title: 'Add Product' });
};

// Create Product
exports.store = async (req, res) => {
    try {
        const images = req.files.map(file => file.path); // Get image paths from multer

        const product = new Product({
            name: req.body.name,
            price: req.body.price,
            original_price: req.body.original_price,
            discount: req.body.discount,
            model_number: req.body.model_number,
            key_features: req.body.key_features,
            product_description: req.body.product_description,
            warranty: req.body.warranty,
            category: req.body.category,
            subcategory: req.body.subcategory,
            images: images
        });

        await product.save();
        res.redirect('/admin/product');  // Redirect to the products page after successful save
    } catch (err) {
        res.status(500).send('Error saving product: ', err);
    }
};

// Render Edit Form
exports.renderEdit = async (req, res) => {
    const product = await Product.findById(req.params.id).populate('category subCategory');
    const categories = await Category.find();
    const subCategories = await SubCategory.find();
    res.render('admin/products/edit', { product, categories, subCategories, title: 'Edit Product' });
};

// Update Product
exports.update = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).render('admin/products/edit', {
            errors: errors.array()
        });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');

    upload(req, res, async (err) => {
        if (err) return res.status(500).send('Error uploading images');
        product.set({
            ...req.body,
            images: req.files ? req.files.map(file => file.path) : product.images
        });
        await product.save();
        res.redirect('/admin/product');
    });
};

// Delete Product
exports.delete = async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).send('Product not found');
    product.images.forEach(image => fs.unlinkSync(path.join(__dirname, '..', '..', image)));
    await product.remove();
    res.redirect('/admin/product');
};

exports.getByCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const subCategories = await SubCategory.find({ category: categoryId });
        res.json(subCategories);
    } catch (error) {
        console.error('Error fetching subcategories:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};