const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
  emetteurId : {type : String, required: true},
  destinataireId : {type : String, required: true},
  body: { type: String, required: true, unique: true },
  date: { type: Date, required: true }
});

module.exports = mongoose.model('Messages', userSchema);