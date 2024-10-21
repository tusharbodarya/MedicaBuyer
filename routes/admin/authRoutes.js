const express = require('express');
const { login, logout, loginForm } = require('../../controllers/admin/authController');
const router = express.Router();

router.get('/login', loginForm);
// router.post('/login', loginValidator, login);
router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
