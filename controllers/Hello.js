const express = require('express');
const router = express.Router();

router.get('/hello', (req, res) => {
  res.send('<h1>Hello</h1>');
});

module.exports = router;
