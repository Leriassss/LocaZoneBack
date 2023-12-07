const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const filtresCtrl = require('../controllers/filtres');

router.get('/',auth, filtresCtrl.getFiltres);
router.get('/:id',auth, filtresCtrl.getOneFiltre);
router.post('/',auth, filtresCtrl.postFiltre);
router.put('/:id',auth, filtresCtrl.putFiltre);
router.delete('/:id',auth, filtresCtrl.delFiltre);

module.exports = router;