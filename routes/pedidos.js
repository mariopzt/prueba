const express = require('express');
const router = express.Router();
const Item = require('../models/item');

router.get('/', async (req, res) => {
  try {
    const itemsDisponibles = await Item.find({ cantidad: { $gt: 0 } });
    res.json(itemsDisponibles);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { itemId, cantidad } = req.body;
    
    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }

    if (item.cantidad < cantidad) {
      return res.status(400).json({ mensaje: 'No hay suficiente cantidad disponible' });
    }

    item.cantidad -= cantidad;
    await item.save();

    res.status(201).json({
      mensaje: 'Pedido realizado con éxito',
      item: item
    });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

module.exports = router;
