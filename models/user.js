const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  Tipo: { type: String, default: 'usuario' } // Campo agregado
});

module.exports = mongoose.model('User', userSchema);
