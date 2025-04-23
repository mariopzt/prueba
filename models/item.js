const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: String,
  cantidad: Number,
  descripcion: String
});

module.exports = mongoose.model('Item', itemSchema);
