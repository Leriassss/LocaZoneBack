const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const spCtrl = require('../controllers/specials');

router.get('/localisation',spCtrl.getLocalisation);
router.get('/grant/:id',auth,spCtrl.grant);

module.exports = router;