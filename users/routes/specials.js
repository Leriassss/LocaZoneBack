const express = require('express');
const router = express.Router();

const spCtrl = require('../controllers/specials');

router.get('/localisation',spCtrl.getLocalisation);

module.exports = router;