const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  nameVendor : {type: String, required : true},
  ifu : { type : Number, required : true, unique : true},
  idCard : {type : String, required : true},
  localisation : {type : String, required : true},
  description : {type : String, required : true},
  idUser : {type : String, required : true},
  dateCreation : {type : Date, required : true} 
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Entreprise', userSchema);