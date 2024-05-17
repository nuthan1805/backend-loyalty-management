const express = require('express');
const router = express.Router();
const { getMembers } = require('../controllers/memberController');

router.get('/', getMembers);

module.exports = router;
