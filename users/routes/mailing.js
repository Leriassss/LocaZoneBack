const express = require('express');
const router = express.Router();
const mailingCtrl = require('../controllers/mailing');

router.get('/', mailingCtrl.mailing);

module.exports = router;