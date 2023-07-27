const express = require('express');
const router = express.Router();
const messagesCtrl = require('../controllers/messages');
const auth = require('../middlewares/auth')

router.post('/', auth, messagesCtrl.createMessage);
router.get('/', auth, messagesCtrl.getAllMessages);

module.exports = router;