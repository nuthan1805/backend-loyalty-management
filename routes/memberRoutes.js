const express = require('express');
const router = express.Router();
const { getMembers, addMember, deleteMember, updateMember,getMemberById } = require('../controllers/memberController');

router.get('/', getMembers);

router.get('/:member_id',getMemberById);

router.post('/', addMember);

router.delete('/:member_id', deleteMember);

router.put('/:member_id', updateMember);

module.exports = router;
