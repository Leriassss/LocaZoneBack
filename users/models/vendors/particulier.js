const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  nameVendor : {type: String, required : true},
  idCard : {type : String, required : true},
  description : {type : String, required : true},
  idUser : {type : String, required : true},
  dateCreation : {type : Date, required : true} 
});

module.exports = mongoose.model('Particulier', userSchema);