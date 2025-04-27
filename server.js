const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Endpoint mínimo para comprobar funcionamiento
app.get('/ping', (req, res) => {
  res.send('pong');
});

// Endpoint raíz para comprobar funcionamiento
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando' });
});

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB Atlas'))
  .catch(err => console.error('Error de conexión:', err));

// Importar rutas
const itemsRouter = require('./routes/items');
const pedidosRouter = require('./routes/pedidos');

// Usar rutas
app.use('/api/items', itemsRouter);
app.use('/api/pedidos', pedidosRouter);

// === Endpoints CRUD para usuarios como objetos normales ===
const bcrypt = require('bcryptjs');
const User = require('./models/user');

// Verificar existencia de usuario
app.post('/api/user/check', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ exists: false, message: 'Falta el nombre de usuario' });
    const user = await User.findOne({ username });
    res.json({ exists: !!user });
  } catch (error) {
    res.status(500).json({ exists: false, message: 'Error en el servidor' });
  }
});

// Cambiar contraseña de usuario
app.post('/api/user/update-password', async (req, res) => {
  try {
    const { username, newPassword } = req.body;
    if (!username || !newPassword) return res.status(400).json({ message: 'Faltan datos' });
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar contraseña', error: error.message });
  }
});

// Agregar nuevo usuario
app.post('/api/user/add', async (req, res) => {
  try {
    const { username, password, tipo } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'Faltan datos' });
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'El usuario ya existe' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ username, password: passwordHash, Tipo: tipo || 'usuario' });
    await user.save();
    res.json({ message: 'Usuario agregado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar usuario', error: error.message });
  }
});

// Eliminar usuario
app.post('/api/user/delete', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: 'Falta el nombre de usuario' });
    const deleted = await User.deleteOne({ username });
    if (deleted.deletedCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
  }
});

// Registro seguro de usuario (guardar usuario y contraseña hasheada)
app.post('/api/register', async (req, res) => {
  try {
    // Permite recibir 'tipo' o 'Tipo' pero siempre guarda en 'Tipo' (mayúscula)
    const { username, password, tipo } = req.body;
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'El usuario ya existe' });
    const passwordHash = await bcrypt.hash(password, 10);
    
    const user = new User({ username, password: passwordHash, tipo: tipo || '' });
    await user.save();
    res.json({ message: 'Usuario registrado correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al registrar usuario', error: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { username, password  } = req.body;
    const user = await User.findOne({ username });
    console.log('Intentando login:', { username, password, hash: user && user.password });
    if (!user) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    // Verificar el campo Tipo del usuario
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
    res.json({ username: user.username, tipo: user.Tipo });
  } catch (error) {
    console.error('Error en /api/login:', error);
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
});


// Cambiar nombre de usuario
app.post('/api/user/update-username', async (req, res) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
