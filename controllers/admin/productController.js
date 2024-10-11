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
    const products = await Product.find().populate('category subCategory');
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
    const errors = validationResult(req);
    const categories = await Category.find();
    if (!errors.isEmpty()) {
        return res.status(400).render('admin/products/add', {
            errors: errors.array(),
            categories,
            title: 'Add Product'
        });
    }
    
    upload(req, res, async (err) => {
        if (err) return res.status(500).send('Error uploading images');
        const product = new Product({
            ...req.body,
            images: req.files.map(file => file.path)
        });
        await product.save();
        res.redirect('/admin/product');
    });
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
    res.redirect('/admin/products');
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