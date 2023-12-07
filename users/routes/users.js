const express = require('express');
const router = express.Router();
const usersValidators = require('../middlewares/users-validators');
const auth = require('../middlewares/auth')
const usersCtrl = require('../controllers/users');

router.post('/signin', usersCtrl.signin);
router.post('/signup', usersValidators, usersCtrl.signup);
router.post('/likes/:id', auth, usersCtrl.addLike);
router.get('/', usersCtrl.unicity);
router.get('/dashboard',auth, usersCtrl.dashboard);

module.exports = router;