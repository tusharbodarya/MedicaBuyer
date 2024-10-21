const express = require('express');
const { getDashboard } = require('../../controllers/admin/vendorController');
const { isAuthenticated, authorizeRoles } = require('../../middlewares/authMiddleware');
const router = express.Router();

router.get('/dashboard', isAuthenticated, authorizeRoles('vendor'), getDashboard);

module.exports = router;
