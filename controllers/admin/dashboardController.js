// controllers/admin/dashboardController.js
const User = require('../../models/User'); // Adjust the path according to your project structure
const Product = require('../../models/Product'); // Assuming you have a Product model

const dashboard = async (req, res) => {
    try {
        // Check if the user is authenticated
        // if (!req.isAuthenticated()) {
        //     return res.redirect('/admin/login'); // Early return to avoid further execution
        // }

        // Fetch data for the dashboard
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const vendors = await User.find({ role: 'vendor' }); // Get all vendors

        // Render the dashboard with the fetched data
        return res.render('admin/dashboard', {
            totalUsers,
            totalProducts,
            vendors,
            user: req.user,
            title : 'Dashboard'
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (!res.headersSent) { // Check if headers have already been sent
            return res.status(500).send('Internal Server Error'); // Only send a response if not already sent
        }
    }
};

module.exports = {
    dashboard
};
