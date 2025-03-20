const express = require('express');
const { getTopUsers } = require('../controllers/userController');
const router = express.Router();

router.get('/', getTopUsers);

module.exports = router;
