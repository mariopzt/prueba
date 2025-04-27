// Endpoint para cambiar el nombre de usuario
const express = require('express');
const router = express.Router();
const User = require('./models/user');

// POST /api/user/update-username
router.post('/api/user/update-username', async (req, res) => {
  try {
    const { oldUsername, newUsername } = req.body;
    if (!oldUsername || !newUsername) {
      return res.status(400).json({ message: 'Faltan datos' });
    }
    const user = await User.findOne({ username: oldUsername });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    const existing = await User.findOne({ username: newUsername });
    if (existing) {
      return res.status(400).json({ message: 'El nuevo nombre de usuario ya existe' });
    }
    user.username = newUsername;
    await user.save();
    res.json({ message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
  }
});

module.exports = router;
