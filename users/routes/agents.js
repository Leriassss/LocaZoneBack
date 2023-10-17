const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const agentsCtrl = require('../controllers/agents');
const multer = require('../middlewares/multer-config-ids');
const getFiles = require('../middlewares/register_getfiles')

router.get('/', agentsCtrl.getAgents);
router.get('/infos', auth, agentsCtrl.getAgentInfos);
router.get('/personal', auth, agentsCtrl.getPersonalInfos);
router.post('/register', auth, multer,getFiles,agentsCtrl.register);

module.exports = router;