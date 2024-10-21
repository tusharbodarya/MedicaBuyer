const jwt = require('jsonwebtoken');

exports.isAuthenticated = (req, res, next) => {
    const token = req.cookies.token || '';
    if (!token) return res.redirect('/admin/login');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.redirect('/admin/login');
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).send('Access Denied');
        }
        next();
    };
};
