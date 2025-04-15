const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  cantidad: Number,
  proveedor: String,
  fecha: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);
