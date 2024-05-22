const express = require('express');
const router = express.Router();
const { addTransaction, getTransactionHistory } = require('../controllers/transactionController');

router.post('/', addTransaction);
router.get('/history/:member_id', getTransactionHistory); 

module.exports = router;
