const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth-vendor');
const housesCtrl = require('../controllers/houses');
const multer = require('../middlewares/multer-config');
const houseValidator = require('../middlewares/house-validator')
const getFiles = require('../middlewares/getfiles')

router.post('/',auth,multer,getFiles,houseValidator, housesCtrl.postHouse);
router.get('/', housesCtrl.getHouse);
router.get('/options',housesCtrl.getOptions);
router.get('/vendor',auth,housesCtrl.getHouseVendor);
router.get('/:id',housesCtrl.getOneHouse);
router.get('/agents/houses/:id', housesCtrl.getAgentHouses);
router.put('/:id',auth,multer,getFiles, housesCtrl.alterHouse)
router.delete('/:id',auth, housesCtrl.deleteHouse)

module.exports = router;