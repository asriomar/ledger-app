const Transaction = require('../models/Transaction');

// @desc    Get all transactions
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json({ success: true, data: transactions });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Add a transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
    try {
        // We get text, amount, and type from the frontend request body
        const { text, amount, type } = req.body;
        const transaction = await Transaction.create(req.body);

        res.status(201).json({ success: true, data: transaction });
    } catch (err) {
        res.status(400).json({ success: false, error: 'Invalid data' });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({ success: false, error: 'No transaction found' });
        }
        await transaction.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};