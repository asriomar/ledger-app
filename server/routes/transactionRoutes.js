const express = require('express');
const router = express.Router();
const { getTransactions, addTransaction, deleteTransaction } = require('../controllers/transactionController');
const protect = require('../middleware/authMiddleware'); // Import guard

// Add 'protect' to the routes you want to hide from strangers
router.route('/')
    .get(protect, getTransactions)
    .post(protect, addTransaction);

router.route('/:id')
    .delete(protect, deleteTransaction);

module.exports = router;