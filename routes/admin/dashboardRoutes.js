const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboardController');
const { isAuthenticated, authorizeRoles } = require('../../middlewares/authMiddleware');

router.get('/dashboard', isAuthenticated, authorizeRoles('admin'), dashboardController.dashboard);

module.exports = router;