const express = require('express');
const router = express.Router();
const { login, logout, loginForm } = require('../../controllers/admin/authController');
const { loginValidator } = require('../../validators/authValidator');

router.get('/login', loginForm)
router.post('/login', loginValidator, login);
router.get('/logout', logout);

module.exports = router;
