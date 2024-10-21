const User = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Show the login form
exports.loginForm = (req, res) => {
    createDefaultAdmin();
    res.render('admin/auth/login');
};

// Handle login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('User not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send('Invalid password');

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    res.cookie('token', token);

    // Redirect to the respective dashboard
    if (user.role === 'admin') return res.redirect('/admin/dashboard');
    if (user.role === 'vendor') return res.redirect('/vendor/dashboard');
    res.redirect('/');
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect('/admin/login');
};

async function createDefaultAdmin() {
    const admin = await User.findOne({ role: 'admin' });
    if (!admin) {
        const user = new User({
            email: 'admin@medico.com',
            password: 'admin',
            role: 'admin',
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();
    }
}
