const mongoose = require('mongoose');

const AwardSchema = new mongoose.Schema({
    image: {
        type: String,
        required: false, // Image is nullable
    },
    title: {
        type: String,
        required: false, // Title is nullable
    },
    description: {
        type: String,
        required: true, // Description is required
        validate: {
            validator: function(v) {
                return v && v.length > 0; // Ensure it's not empty
            },
            message: 'Description is required.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Award = mongoose.model('Award', AwardSchema);
module.exports = Award;
