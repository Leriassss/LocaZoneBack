const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


const houseSchema = mongoose.Schema({
  type : {type: String, enum : ['sanitaire','semi-sanitaire','ordinaire'], required: true},
  categorie : {type: String, enum : ['location','vente','séjour'], required: true},
  localisation : {type : String, required: true},
  superficie : {type : Number},
  prix : {type : Number, required: true},
  voisin : {type : Number, required: true},
  /*couloir: {type : Boolean, required: true},
  carreau : {type : Boolean, required: true},
  voisin : {type : Number, required: true},*/
  vendor: {type : String, required : true},
  userId: {type: String, required: true}
});

houseSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Houses', houseSchema);