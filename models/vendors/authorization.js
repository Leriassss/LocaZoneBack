const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  idUser : {type: String, required : true},
  auth : {type: String, enum:['user','client','vendor','admin'], required : true}
});

module.exports = mongoose.model('Authorization', userSchema);