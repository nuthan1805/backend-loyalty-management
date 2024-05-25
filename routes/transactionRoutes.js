const express = require('express');
const router = express.Router();
const { addTransaction, getTransactionHistory } = require('../controllers/transactionController');
const authenticateToken = require('../middlewares/authMiddleware');

router.post('/', authenticateToken, addTransaction);
router.get('/history/:member_id', authenticateToken, getTransactionHistory);

module.exports = router;
