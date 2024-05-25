const express = require('express');
const { getMembers, addMember, deleteMember, updateMember, getMemberById } = require('../controllers/memberController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', authenticateToken, getMembers);
router.post('/', authenticateToken, addMember);
router.get('/:member_id', authenticateToken, getMemberById);
router.put('/:member_id', authenticateToken, updateMember);
router.delete('/:member_id', authenticateToken, deleteMember);

module.exports = router;
