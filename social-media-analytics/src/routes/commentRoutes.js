const express = require('express');
const { getComments } = require('../controllers/commentController');
const router = express.Router();

router.get('/:postId', getComments);

module.exports = router;
