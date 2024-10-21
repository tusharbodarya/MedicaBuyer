exports.getDashboard = (req, res) => {
    res.render('admin/vendor/dashboard', { user: req.user });
};
