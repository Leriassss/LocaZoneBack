const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const houseFeaturesSchema = new mongoose.Schema({
  superficie : {type: Number},
  url: {type: String, required : true, unique : true},
  type: {type: String, required: true},
  idHouse:{type: String, required: true}
});

houseFeaturesSchema.plugin(uniqueValidator);

module.exports = mongoose.model('HouseFeatures', houseFeaturesSchema );