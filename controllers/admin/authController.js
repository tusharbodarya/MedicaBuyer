const LocalStrategy = require('passport-local').Strategy;
const User = require('../../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

// Show the login form
exports.loginForm = (req, res) => {
    createDefaultAdmin();
    res.render('admin/auth/login');
};

// Handle login
exports.login = (req, res, next) => {
    passport.use(new LocalStrategy(
        {
            usernameField: 'email', // or 'username' based on your login form
            passwordField: 'password',
        },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email }); // Adjust field as needed
                if (!user) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }
    
                // Here, you should verify the password (assuming you are using bcrypt)
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect email or password.' });
                }
    
                // Return the user if found and password is correct
                return done(null, user);
            } catch (err) {
                return done(err);
            }
        }
    ));
};

exports.logout = (req, res) => {
    req.logout();
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
