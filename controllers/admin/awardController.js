const Award = require('../../models/Award');
const path = require('path');
const fs = require('fs');

// List Awards & Recognitions
exports.listAwards = async (req, res) => {
    try {
        const awards = await Award.find({});
        res.render('admin/awards/list', { awards, title: 'Awards & Recognitions' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Create Award form
exports.createAwardForm = (req, res) => {
    res.render('admin/awards/create', { title: 'Create Award' });
};

// Create new Award
exports.createAward = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file ? `/uploads/awards-images/${req.file.filename}` : null;

        // Validate description
        if (!description || description.trim().length === 0) {
            return res.status(400).send('Description is required');
        }

        const award = new Award({ image, title, description });
        await award.save();
        res.redirect('/admin/awards');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Edit Award form
exports.editAwardForm = async (req, res) => {
    try {
        const award = await Award.findById(req.params.id);
        if (!award) {
            return res.status(404).send('Award not found');
        }
        res.render('admin/awards/edit', { award, title: 'Edit Award' });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Update Award
exports.updateAward = async (req, res) => {
    try {
        const { title, description } = req.body;
        const image = req.file ? `/uploads/awards-images/${req.file.filename}` : null;

        // Validate description
        if (!description || description.trim().length === 0) {
            return res.status(400).send('Description is required');
        }

        const award = await Award.findById(req.params.id);
        if (!award) {
            return res.status(404).send('Award not found');
        }

        if (image && award.image) {
            // Delete old image if new one is uploaded
            const oldImagePath = path.join(__dirname, '..', '..', award.image);
            if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
            }
        }

        award.title = title;
        award.description = description;
        award.image = image || award.image; // Update image only if a new one is provided

        await award.save();
        res.redirect('/admin/awards');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

// Delete Award
exports.deleteAward = async (req, res) => {
    try {
        const award = await Award.findById(req.params.id);

        if (!award) {
            return res.status(404).send('Award not found');
        }

        // Delete image from the file system
        if (award.image) {
            const imagePath = path.join(__dirname, '..', '..', award.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await Award.findByIdAndDelete(req.params.id);

        res.redirect('/admin/awards');
    } catch (error) {
        res.status(500).send('Server Error');
    }
};
