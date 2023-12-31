const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
    },
    dateMade: {
        type: Date,
        required: true,
    },
    datePacked: {
        type: Date,
        required: true,
    },
    quartsMade: {
        type: Number,
        required: function () {
            return this.isLiquid;
        },
    },
    pintsMade: {
        type: Number,
        required: function () {
            return this.isLiquid;
        },
    },
    body: {
        type: String,
    },
    relabeled: {
        type: Date,
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

// Virtual field to get the isLiquid value from the referenced product
batchSchema.virtual('isLiquid').get(function () {
    return this.product.isLiquid;
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
