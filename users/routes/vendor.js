const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const entrepriseCtrl = require('../controllers/entreprise');
const particulierCtrl  = require('../controllers/particulier');
const demarcheurCtrl = require('../controllers/demarcheur');

router.post('/entreprise', auth, entrepriseCtrl.createEntreprise);
router.get('/entreprise', auth, entrepriseCtrl.getEntreprise);
router.get('/entreprise/:id', auth, entrepriseCtrl.getOneEntreprise);
router.put('/entreprise', auth, entrepriseCtrl.modifyEntreprise);
router.delete('/entreprise', auth, entrepriseCtrl.deleteEntreprise);
router.get('/entreprise/all', auth, entrepriseCtrl.getAllEntreprise);

router.post('/demarcheur', auth, demarcheurCtrl.createDemarcheur);
router.get('/demarcheur', auth, demarcheurCtrl.getDemarcheur);
router.get('/demarcheur/:id', auth, demarcheurCtrl.getOneDemarcheur);
router.put('/demarcheur', auth, demarcheurCtrl.modifyDemarcheur);
router.delete('/demarcheur', auth, demarcheurCtrl.deleteDemarcheur);
router.get('/demarcheur/all', auth, demarcheurCtrl.getAllDemarcheur);

router.post('/particulier', auth, particulierCtrl.createParticulier);
router.get('/particulier', auth, particulierCtrl.getParticulier);
router.get('/particulier/:id', auth, particulierCtrl.getOneParticulier);
router.put('/particulier', auth, particulierCtrl.modifyParticulier);
router.delete('/particulier', auth, particulierCtrl.deleteParticulier);
router.get('/particulier/all', auth, particulierCtrl.getAllParticulier);


module.exports = router;