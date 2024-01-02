const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    isLiquid: {
        type: Boolean,
        required: true,
    },
    price: {
        type: Number,
    },
    pricePerPint: {
        type: Number,
    },
    pricePerQuart: {
        type: Number,
    },
    pluNumber: {
        type: String,
        unique: true,
    },
    pluNumberPerQuart: {
        type: String,
    },
    pluNumberPerPint: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, 
});

// Pre-save middleware
productSchema.pre('save', function(next) {
    // If the product is liquid, override price and pluNumber with liquid-specific values
    if (this.isLiquid) {
        this.price = null;  // Set to null or update accordingly
        this.pluNumber = null;  // Set to null or update accordingly
    } else {
        // If the product is not liquid, set liquid-specific values to null
        this.pricePerPint = null;
        this.pricePerQuart = null;
        this.pluNumberPerPint = null;
        this.pluNumberPerQuart = null;
    }
    next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;