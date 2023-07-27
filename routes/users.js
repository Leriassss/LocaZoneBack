const express = require('express');
const router = express.Router();
const usersValidators = require('../middlewares/users-validators');
const usersCtrl = require('../controllers/users');

router.post('/signin', usersCtrl.signin);
router.post('/signup', usersValidators, usersCtrl.signup);
router.get('/', usersCtrl.unicity);

module.exports = router;