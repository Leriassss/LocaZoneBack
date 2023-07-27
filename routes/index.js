const express = require('express');
const router = express.Router();

const auth = require('../middlewares/auth');
const index = require('../controllers/index');


router.get('/', auth, index.authUser);

module.exports = router;