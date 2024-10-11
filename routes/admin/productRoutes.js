const express = require('express');
const router = express.Router();
const productController = require('../../controllers/admin/productController');
const productValidator = require('../../middlewares/productValidator');

router.get('/product/', productController.list);
router.get('/product/add', productController.renderCreate);
router.post('/product/create', productValidator, productController.store);
router.get('/product/edit/:id', productController.renderEdit);
router.post('/product/update/:id', productValidator, productController.update);
router.get('/product/delete/:id', productController.delete);
router.get('/product/category/:categoryId', productController.getByCategory);

module.exports = router;
