const express = require('express');
const router = express.Router();
const Item = require('../models/item');

// GET - Obtener todos los items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

// POST - Crear un nuevo item
router.post('/', async (req, res) => {
  try {
    const nuevoItem = new Item(req.body);
    const itemGuardado = await nuevoItem.save();
    res.status(201).json(itemGuardado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// PUT - Actualizar un item existente
router.put('/:id', async (req, res) => {
  try {
    const itemActualizado = await Item.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!itemActualizado) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    res.json(itemActualizado);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
});

// DELETE - Eliminar un item
router.delete('/:id', async (req, res) => {
  try {
    const itemEliminado = await Item.findByIdAndDelete(req.params.id);
    if (!itemEliminado) {
      return res.status(404).json({ mensaje: 'Item no encontrado' });
    }
    res.json({ mensaje: 'Item eliminado correctamente', item: itemEliminado });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
});

module.exports = router;
