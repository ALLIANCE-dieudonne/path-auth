const express = require('express');
const router = express.Router();
const registerControllers = require('../controllers/refreshTokenController');

router.get('/',registerControllers.handleRefreshToken);

module.exports = router;