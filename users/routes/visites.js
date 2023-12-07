const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const visitesCtrl = require('../controllers/visites');

router.get('/user',auth, visitesCtrl.getUserPlanning);
router.get('/vendor',auth, visitesCtrl.getVendorPlanning);
router.get('/planning/:id', visitesCtrl.getVisitePlanning);
router.post('/:id',auth, visitesCtrl.getPostVisite);
router.put('/vendor/:id',auth, visitesCtrl.putVisiteVendor);
router.put('/user/:id', auth, visitesCtrl.putVisiteUser);

module.exports = router;