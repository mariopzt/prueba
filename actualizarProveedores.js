// Script temporal para actualizar todos los items antiguos y ponerles un proveedor por defecto
require('dotenv').config();
const mongoose = require('mongoose');
const Item = require('./models/item');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    try {
      const res = await Item.updateMany(
        { $or: [{ proveedor: { $exists: false } }, { proveedor: '' }] },
        { $set: { proveedor: 'Sin proveedor' } }
      );
      console.log('Items actualizados:', res.modifiedCount);
    } catch (err) {
      console.error('Error actualizando proveedores:', err);
    } finally {
      mongoose.disconnect();
    }
  });
