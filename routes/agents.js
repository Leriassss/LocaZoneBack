const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth-vendor');
const agentsCtrl = require('../controllers/agents');
const multer = require('../middlewares/multer-config');
const getFiles = require('../middlewares/getfiles')

router.get('/', agentsCtrl.getAgents);


module.exports = router;