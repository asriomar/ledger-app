const mongoose = require('mongoose');

// This defines the "shape" of a single transaction
const TransactionSchema = new mongoose.Schema({
    text: {
        type: String,
        required: [true, 'Please add a description']
    },
    amount: {
        type: Number,
        required: [true, 'Please add a positive or negative number']
    },
    type: {
        type: String,
        enum: ['income', 'expense'], // Only these two words are allowed
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Transaction', TransactionSchema);