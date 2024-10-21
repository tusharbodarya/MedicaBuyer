const express = require('express');
const router = express.Router();
const userController = require('../../controllers/admin/userController');

// List users
router.get('/admin/users', userController.list);

// Show form to add user
router.get('/admin/users/add', userController.addForm);

// Add new user
router.post('/admin/users/add', userController.add);

// Show form to edit user
router.get('/admin/users/edit/:id', userController.editForm);

// Update user
router.post('/admin/users/edit/:id', userController.update);

// Delete user
router.post('/admin/users/delete/:id', userController.delete);

module.exports = router;