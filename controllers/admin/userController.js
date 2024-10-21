const User = require('../../models/User');
const bcrypt = require('bcrypt');

exports.list = async (req, res) => {
    try {
        const users = await User.find();
        res.render('admin/users/list', { users, title: 'Users' });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Error loading users');
    }
};


exports.addForm = async (req, res) => {
    res.render('admin/users/add', { title: 'Add User' });
};

exports.add = async (req, res) => {
    try {
        const { email, password, phone, role } = req.body;

        console.log('phone:', phone);
        console.log('role:', role);
        console.log('email:', email);
        console.log('password:', password);

        // Ensure phone/phone is not null or empty
        if (!phone || phone.trim() === "") {
            throw new Error("phone number is required");
        }

        // Hash password (if applicable)
        const hashedPassword = await bcrypt.hash(password, 10); // Example if you are hashing passwords

        // Create new user object
        const newUser = new User({
            email,
            password: hashedPassword,
            phone: phone,  // Ensure phone is assigned correctly here
            role
        });

        // Save the new user
        await newUser.save();

        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error adding user:', error.message || error);
        res.status(400).json({ error: error.message || 'Error adding user' });
    }
};

exports.editForm = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.render('admin/users/edit', { user, title: 'Edit User' });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).send('Error loading user');
    }
};

exports.update = async (req, res) => {
    try {
        const { email, password, phone, role } = req.body;
        await User.findByIdAndUpdate(req.params.id, { email, password, phone, role });
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
    }
};

exports.delete = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin/users');
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
    }
};