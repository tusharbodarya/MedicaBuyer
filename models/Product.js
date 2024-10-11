const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    // vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    subcategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    original_price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    model_number: {
        type: String,
        required: true
    },
    key_features: {
        type: String
    },
    product_description: {
        type: String
    },
    warranty: {
        type: String
    },
    images: [{
        type: String
    }],
    is_active: {
        type: Boolean,
        default: true
    },
    is_sellable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', ProductSchema);
