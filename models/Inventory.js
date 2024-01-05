const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    datePacked: {
        type: Date,
        default: Date.now,
    },
    dateInCase: {
        type: Date,
        default: Date.now,
    },
    quartsMade: {
        type: Number,
    },
    pintsMade: {
        type: Number,
    },
    body: {
        type: String,
    },
    isWaste: {
        type: Boolean,
        default: false,
    },
    itemsLost: {
        type: Number,
    },
    pintsLost: {
        type: Number,
    },
    quartsLost: {
        type: Number,
    },
    itemsSold: {
        type: Number,
    },
    pintsSold: {
        type: Number,
    },
    quartsSold: {
        type: Number,
    },
    loss: {
        type: Number,
    },
    gain: {
        type: Number,
    },
    revenue: {
        type: Number,
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
    relabeled: {
        type: Date,
    },
    wasteDate: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, 
});


// Pre-save middleware
inventorySchema.pre('save', function(next) {
    // If the product is liquid, set qty of qts made and pts made and set overall qty to sum of both
    if (this.quartsMade || this.pintsMade) {
        this.quantity = this.quartsMade + this.pintsMade;  
    } else {
        // If the product is not liquid, set liquid specific values to null
        this.pintsMade = null;
        this.quartsMade = null;
    }
    next();
});

const Inventory = mongoose.model('Inventory', inventorySchema);

module.exports = Inventory;