
const express = require('express');
const router = express.Router();
const { addTransaction, getTransactions, updateTransaction, deleteTransaction, getTransactionHistory } = require('../controllers/transactionController');

router.post('/', addTransaction);
router.get('/', getTransactions);
router.put('/:member_id', updateTransaction);
router.delete('/:id', deleteTransaction);
router.get('/history/:member_id', getTransactionHistory);

module.exports = router;
