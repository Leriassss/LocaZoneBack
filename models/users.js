const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  pseudo : {type : String, required: true, unique: true},
  tel : {type : String, required: true, unique: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  auth : {type: String, enum:['user','client','vendor','admin'], required : true},
  vendor: {type : Number, required : true},

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Users', userSchema);