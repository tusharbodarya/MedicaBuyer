const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');
const multer = require('multer');

// Multer setup for handling image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');  // Save images to 'uploads' folder
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);  // Unique file names
    }
});
const upload = multer({ storage: storage });

router.get('/product/', productController.list);
router.get('/product/add', productController.renderCreate);
router.post('/product/create', upload.array('images', 5), productController.store);
router.get('/product/edit/:id', productController.renderEdit);
router.post('/product/update/:id', productController.update);
router.get('/product/delete/:id', productController.delete);
router.get('/product/category/:categoryId', productController.getByCategory);

module.exports = router;
