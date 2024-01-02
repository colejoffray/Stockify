const mongoose = require('mongoose');

const batchSchema = new mongoose.Schema({
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
        required: true,
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
    relabeled: {
        type: Date,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }, 
});


// Pre-save middleware
batchSchema.pre('save', function(next) {
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

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;
