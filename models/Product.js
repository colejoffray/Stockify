const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    pluNumber: {
        type: String,
        unique: true,
    },
    isLiquid: {
        type: Boolean,
        required: true,
    },
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;